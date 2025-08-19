import React, { useState } from 'react';
import { Eye, EyeOff, Building2 } from 'lucide-react';

// Define LoginCredentials interface directly here
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      return;
    }
    await onLogin(credentials);
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient flex items-center justify-center">
      <div className="card animate-fade-in" style={{ maxWidth: '32rem' }}>
        <div className="text-center mb-8">
          <div className="icon-container">
            <Building2 />
          </div>
          <h1 className="title">PropFlow</h1>
          <p className="subtitle">Enterprise Property Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={credentials.email}
              onChange={handleInputChange('email')}
              className="form-input"
              placeholder="admin@demoproperties.com"
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleInputChange('password')}
                className="form-input"
                style={{ paddingRight: '3rem' }}
                placeholder="admin123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
          >
            {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo: admin@demoproperties.com / admin123</p>
        </div>
      </div>
    </div>
  );
};
