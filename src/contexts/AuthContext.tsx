import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '../services/api/apiService';

// Define interfaces directly in this file
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  entities?: Entity[];
  emailVerified?: boolean;
  lastLoginAt?: Date | null;
  status?: string;
}

interface Entity {
  id: string;
  name: string;
  type: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
  success?: boolean;
  data?: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthContext: Initializing authentication...');
      const storedToken = localStorage.getItem('propflow_token');
      const storedUser = localStorage.getItem('propflow_user');

      if (storedToken && storedUser) {
        try {
          console.log('AuthContext: Found stored token, validating...');

          // FIXED: Handle demo tokens properly
          if (storedToken.startsWith('demo-jwt-token')) {
            console.log('AuthContext: Using demo token');
            const parsedUser = JSON.parse(storedUser);

            // Ensure organizationId is present for demo users
            if (!parsedUser.organizationId) {
              parsedUser.organizationId = 'demo-org';
            }

            setToken(storedToken);
            setUser(parsedUser);
            setLoading(false);
            return;
          }

          // Validate real token with backend
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/validate`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const validationData = await response.json();
            console.log('AuthContext: Token validation successful');
            setToken(storedToken);
            setUser(validationData.user || JSON.parse(storedUser));
          } else {
            console.log('AuthContext: Token validation failed');
            // Token is invalid, clear storage
            localStorage.removeItem('propflow_token');
            localStorage.removeItem('propflow_user');
          }
        } catch (error) {
          console.error('AuthContext: Failed to validate token:', error);
          // FIXED: Better fallback handling
          if (storedToken.startsWith('demo-jwt-token')) {
            // For demo tokens, always use stored data with proper organizationId
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser.organizationId) {
              parsedUser.organizationId = 'demo-org';
            }
            setToken(storedToken);
            setUser(parsedUser);
          } else {
            // Clear invalid real tokens
            localStorage.removeItem('propflow_token');
            localStorage.removeItem('propflow_user');
          }
        }
      } else {
        console.log('AuthContext: No stored authentication found');
      }

      setLoading(false);
      console.log('AuthContext: Authentication initialization complete');
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('AuthContext: Starting login process...');
      setLoading(true);

      // Try real API first
      try {
        const response = await apiService.login(credentials.email, credentials.password);

        // In your AuthContext login method, after the API call
        console.log('AuthContext: Full API response:', response);
        console.log('AuthContext: User from response:', response.user || response.data?.user);
        console.log('AuthContext: OrganizationId:', (response.user || response.data?.user)?.organizationId);

        if (response && (response.success !== false)) {
          // Handle successful API response
          const authData: AuthResponse = response.data || response;
          console.log('AuthContext: Real API login successful');

          setUser(authData.user);
          setToken(authData.accessToken);
          localStorage.setItem('propflow_token', authData.accessToken);
          localStorage.setItem('propflow_user', JSON.stringify(authData.user));
          return;
        }
      } catch (apiError) {
        console.log('AuthContext: API not available, using demo mode:', apiError);

        // Demo mode fallback for development
        if (credentials.email === 'admin@demoproperties.com' && credentials.password === 'admin123') {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

          const mockUser: User = {
            id: '1',
            email: credentials.email,
            firstName: 'Admin',
            lastName: 'User',
            role: 'SUPER_ADMIN',
            organizationId: 'demo-org', // ENSURE this is set
            emailVerified: true,
            status: 'ACTIVE',
            entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', type: 'LLC' }]
          };

          const mockToken = 'demo-jwt-token-' + Date.now();

          console.log('AuthContext: Demo login successful for admin');
          setUser(mockUser);
          setToken(mockToken);
          localStorage.setItem('propflow_token', mockToken);
          localStorage.setItem('propflow_user', JSON.stringify(mockUser));
          return;
        }

        // Other demo users
        const demoUsers: Record<string, User> = {
          'orgadmin@demoproperties.com': {
            id: '2',
            email: 'orgadmin@demoproperties.com',
            firstName: 'Org',
            lastName: 'Admin',
            role: 'ORG_ADMIN',
            organizationId: 'demo-org', // ENSURE this is set
            emailVerified: true,
            status: 'ACTIVE',
            entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', type: 'LLC' }]
          },
          'manager@sunsetproperties.com': {
            id: '3',
            email: 'manager@sunsetproperties.com',
            firstName: 'Property',
            lastName: 'Manager',
            role: 'ENTITY_MANAGER',
            organizationId: 'demo-org', // ENSURE this is set
            emailVerified: true,
            status: 'ACTIVE',
            entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', type: 'LLC' }]
          },
          'maintenance@demoproperties.com': {
            id: '4',
            email: 'maintenance@demoproperties.com',
            firstName: 'Maintenance',
            lastName: 'Staff',
            role: 'MAINTENANCE',
            organizationId: 'demo-org', // ENSURE this is set
            emailVerified: true,
            status: 'ACTIVE',
            entities: []
          },
          'tenant@example.com': {
            id: '5',
            email: 'tenant@example.com',
            firstName: 'John',
            lastName: 'Tenant',
            role: 'TENANT',
            organizationId: 'demo-org', // ENSURE this is set
            emailVerified: true,
            status: 'ACTIVE',
            entities: []
          }
        };

        if (credentials.password === 'admin123' && demoUsers[credentials.email]) {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockUser = demoUsers[credentials.email];
          const mockToken = 'demo-jwt-token-' + Date.now();

          console.log('AuthContext: Demo login successful for', credentials.email);
          setUser(mockUser);
          setToken(mockToken);
          localStorage.setItem('propflow_token', mockToken);
          localStorage.setItem('propflow_user', JSON.stringify(mockUser));
          return;
        }
      }

      // If we get here, credentials are invalid
      console.log('AuthContext: Invalid credentials');
      throw new Error('Invalid credentials. Please check your email and password.');

    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');

      // Try to notify the backend about logout
      if (token && !token.startsWith('demo-jwt-token')) {
        try {
          await apiService.logout();
          console.log('AuthContext: Backend logout successful');
        } catch (error) {
          console.log('AuthContext: Logout API call failed:', error);
          // Continue with local logout even if API fails
        }
      }
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    } finally {
      // Always clear local state
      console.log('AuthContext: Clearing local authentication state');
      setUser(null);
      setToken(null);
      localStorage.removeItem('propflow_token');
      localStorage.removeItem('propflow_user');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    token,
    isAuthenticated: !!user && !!token,
  };

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('AuthContext render state:', {
      hasUser: !!user,
      userOrgId: user?.organizationId,
      hasToken: !!token,
      tokenType: token?.startsWith('demo') ? 'demo' : 'real',
      loading,
      isAuthenticated: !!user && !!token
    });
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};