import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle URL parameters for success messages
  useEffect(() => {
    const setup = searchParams.get('setup');
    const invitation = searchParams.get('invitation');
    const email = searchParams.get('email');

    if (setup === 'success') {
      setSuccessMessage('Organization setup completed successfully! You can now sign in.');
      if (email) {
        setCredentials(prev => ({ ...prev, email: decodeURIComponent(email) }));
      }
    } else if (invitation === 'completed') {
      setSuccessMessage('Account activated successfully! You can now sign in.');
      if (email) {
        setCredentials(prev => ({ ...prev, email: decodeURIComponent(email) }));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      return;
    }
    setSuccessMessage(null); // Clear success message on new login attempt
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

        {successMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#059669',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem' }}>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={credentials.email}
              onChange={handleInputChange('email')}
              className="form-input"
              placeholder="Enter your email address"
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
                placeholder="Enter your password"
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
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
              <span>{error}</span>
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
          <div className="text-center">
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
              New to PropFlow?{' '}
              <Link
                to="/setup"
                style={{
                  color: 'var(--indigo-600)',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--indigo-700)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--indigo-600)'}
              >
                Set up your organization
              </Link>
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
              API Status: {' '}
              <span style={{
                color: navigator.onLine ? '#059669' : '#dc2626',
                fontWeight: 500
              }}>
                {navigator.onLine ? 'Connected' : 'Offline'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};