import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define interfaces directly in this file
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  entities?: Entity[];
}

interface Entity {
  id: string;
  name: string;
  type: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
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
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          localStorage.removeItem('propflow_token');
          localStorage.removeItem('propflow_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // For demo purposes, simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        organizationId: 'demo-org',
        entities: [{ id: 'demo-entity', name: 'Demo Properties', type: 'LLC' }]
      };
      
      const mockToken = 'demo-jwt-token-' + Date.now();
      
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('propflow_token', mockToken);
      localStorage.setItem('propflow_user', JSON.stringify(mockUser));
      
      // Uncomment this when backend is connected:
      // const response = await apiService.login(credentials.email, credentials.password);
      // if (response.success) {
      //   const authData = response.data as AuthResponse;
      //   setUser(authData.user);
      //   setToken(authData.accessToken);
      //   localStorage.setItem('propflow_token', authData.accessToken);
      //   localStorage.setItem('propflow_user', JSON.stringify(authData.user));
      // } else {
      //   throw new Error(response.error || 'Login failed');
      // }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('propflow_token');
    localStorage.removeItem('propflow_user');
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
