import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
      const storedToken = localStorage.getItem('propflow_token');
      const storedUser = localStorage.getItem('propflow_user');

      if (storedToken && storedUser) {
        try {
          // Validate token with backend
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/validate`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const validationData = await response.json();
            setToken(storedToken);
            setUser(validationData.user || JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('propflow_token');
            localStorage.removeItem('propflow_user');
          }
        } catch (error) {
          console.error('Failed to validate token:', error);
          // Fallback to stored user data for development
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);

      // Try real API first
      try {
        const response = await apiService.login(credentials.email, credentials.password);

        if (response && (response.success !== false)) {
          // Handle successful API response
          const authData: AuthResponse = response.data || response;

          setUser(authData.user);
          setToken(authData.accessToken);
          localStorage.setItem('propflow_token', authData.accessToken);
          localStorage.setItem('propflow_user', JSON.stringify(authData.user));
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode:', apiError);

        // Demo mode fallback for development
        if (credentials.email === 'admin@demoproperties.com' && credentials.password === 'admin123') {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

          const mockUser: User = {
            id: '1',
            email: credentials.email,
            firstName: 'Admin',
            lastName: 'User',
            role: 'SUPER_ADMIN',
            organizationId: 'demo-org',
            emailVerified: true,
            status: 'ACTIVE',
            entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', type: 'LLC' }]
          };

          const mockToken = 'demo-jwt-token-' + Date.now();

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
            organizationId: 'demo-org',
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
            organizationId: 'demo-org',
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
            organizationId: 'demo-org',
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
            organizationId: 'demo-org',
            emailVerified: true,
            status: 'ACTIVE',
            entities: []
          }
        };

        if (credentials.password === 'admin123' && demoUsers[credentials.email]) {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockUser = demoUsers[credentials.email];
          const mockToken = 'demo-jwt-token-' + Date.now();

          setUser(mockUser);
          setToken(mockToken);
          localStorage.setItem('propflow_token', mockToken);
          localStorage.setItem('propflow_user', JSON.stringify(mockUser));
          return;
        }
      }

      // If we get here, credentials are invalid
      throw new Error('Invalid credentials. Please check your email and password.');

    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try to notify the backend about logout
      if (token && !token.startsWith('demo-jwt-token')) {
        try {
          await apiService.logout();
        } catch (error) {
          console.log('Logout API call failed:', error);
          // Continue with local logout even if API fails
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};