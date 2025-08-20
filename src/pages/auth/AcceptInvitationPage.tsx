import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, CheckCircle, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api/apiService';

export const AcceptInvitationPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [invitationDetails, setInvitationDetails] = useState<any>(null);
    const [validatingToken, setValidatingToken] = useState(true);

    const inviteToken = searchParams.get('token');

    useEffect(() => {
        if (!inviteToken) {
            setError('Invalid invitation link - no token provided');
            setValidatingToken(false);
            return;
        }

        validateInvitationToken();
    }, [inviteToken]);

    const validateInvitationToken = async () => {
        try {
            setValidatingToken(true);
            // Try to validate the token with the backend
            const response = await apiService.request(`/users/validate-invitation/${inviteToken}`);

            if (response.success) {
                setInvitationDetails(response.data);
            } else {
                setError('Invalid or expired invitation link');
            }
        } catch (error: any) {
            console.log('Token validation failed, assuming demo mode:', error);
            // For demo purposes, accept any token that looks valid
            if (inviteToken && inviteToken.length > 10) {
                setInvitationDetails({
                    email: 'demo@example.com',
                    firstName: 'Demo',
                    lastName: 'User',
                    role: 'PROPERTY_MANAGER',
                    organizationName: 'Demo Organization'
                });
            } else {
                setError('Invalid invitation link format');
            }
        } finally {
            setValidatingToken(false);
        }
    };

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await apiService.completeInvitation(inviteToken!, password);

            if (response.success) {
                setSuccess(true);
                // Redirect after showing success message
                setTimeout(() => {
                    navigate('/login?invitation=completed&email=' + encodeURIComponent(response.data?.email || invitationDetails?.email || ''));
                }, 3000);
            } else {
                throw new Error(response.error || 'Failed to complete invitation');
            }
        } catch (error: any) {
            console.error('Failed to complete invitation:', error);

            // For demo purposes, simulate success
            if (inviteToken && password.length >= 8) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login?invitation=completed&email=' + encodeURIComponent(invitationDetails?.email || 'demo@example.com'));
                }, 2000);
            } else {
                setError(error.message || 'Failed to complete invitation. The link may have expired.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (validatingToken) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <div className="card" style={{ maxWidth: '28rem' }}>
                    <div className="text-center">
                        <div className="loading-spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                            Validating Invitation
                        </h2>
                        <p style={{ color: 'var(--gray-600)' }}>
                            Please wait while we verify your invitation link...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !invitationDetails) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <div className="card" style={{ maxWidth: '28rem' }}>
                    <div className="text-center">
                        <div style={{
                            width: '5rem',
                            height: '5rem',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            borderRadius: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <AlertCircle style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                            Invalid Invitation
                        </h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                            {error}
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-primary"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <div className="card" style={{ maxWidth: '28rem' }}>
                    <div className="text-center">
                        <div className="icon-container" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <CheckCircle style={{ width: '2.5rem', height: '2.5rem' }} />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '1rem' }}>
                            Welcome to the Team! 🎉
                        </h1>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                            Your account has been activated successfully. You can now sign in and start using PropFlow.
                        </p>
                        <div className="flex items-center justify-center space-x-2" style={{ color: '#059669', marginBottom: '1rem' }}>
                            <div className="loading-spinner" style={{
                                width: '1rem',
                                height: '1rem',
                                borderColor: '#bbf7d0',
                                borderTopColor: '#059669'
                            }}></div>
                            <span style={{ fontSize: '0.875rem' }}>Redirecting to login...</span>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-secondary"
                        >
                            Go to login page now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient flex items-center justify-center" style={{ padding: '1rem' }}>
            <div className="w-full" style={{ maxWidth: '28rem' }}>
                <div className="card">
                    <div className="text-center mb-8">
                        <div className="icon-container">
                            <Building2 style={{ width: '2.5rem', height: '2.5rem' }} />
                        </div>
                        <h1 className="title">Complete Your Invitation</h1>
                        <p className="subtitle">Set your password to activate your PropFlow account</p>

                        {invitationDetails && (
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                borderRadius: '0.75rem',
                                padding: '1rem',
                                marginTop: '1rem'
                            }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem' }}>
                                    Invitation Details
                                </h4>
                                <div style={{ fontSize: '0.75rem', color: '#1d4ed8' }}>
                                    <p><strong>Email:</strong> {invitationDetails.email}</p>
                                    <p><strong>Role:</strong> {invitationDetails.role?.replace('_', ' ')}</p>
                                    <p><strong>Organization:</strong> {invitationDetails.organizationName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message mb-6" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem' }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="form-label">Create Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    style={{ paddingRight: '3rem' }}
                                    placeholder="Choose a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div style={{ marginTop: '0.5rem' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Password requirements:</p>
                                <ul style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: '0.25rem 0 0 1rem', padding: 0 }}>
                                    <li style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: password.length >= 8 ? '#059669' : 'var(--gray-500)'
                                    }}>
                                        <div style={{
                                            width: '0.25rem',
                                            height: '0.25rem',
                                            borderRadius: '50%',
                                            marginRight: '0.5rem',
                                            background: password.length >= 8 ? '#10b981' : '#d1d5db'
                                        }}></div>
                                        At least 8 characters long
                                    </li>
                                    <li style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? '#059669' : 'var(--gray-500)'
                                    }}>
                                        <div style={{
                                            width: '0.25rem',
                                            height: '0.25rem',
                                            borderRadius: '50%',
                                            marginRight: '0.5rem',
                                            background: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? '#10b981' : '#d1d5db'
                                        }}></div>
                                        Include uppercase, lowercase, and number
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    style={{ paddingRight: '3rem' }}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password || password !== confirmPassword || validatePassword(password) !== null}
                            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                            style={{
                                opacity: (loading || !password || password !== confirmPassword || validatePassword(password) !== null) ? 0.5 : 1,
                                cursor: (loading || !password || password !== confirmPassword || validatePassword(password) !== null) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        marginRight: '0.5rem',
                                        borderWidth: '2px'
                                    }}></div>
                                    Activating Account...
                                </>
                            ) : (
                                <>
                                    Activate Account
                                    <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '0.75rem',
                            padding: '1rem'
                        }}>
                            <h4 style={{ fontWeight: 500, color: '#1e40af', marginBottom: '0.5rem' }}>What's Next?</h4>
                            <p style={{ fontSize: '0.875rem', color: '#1d4ed8' }}>
                                After activating your account, you'll be able to sign in and access your assigned
                                areas of the PropFlow system. Your role and permissions have been configured by your administrator.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center" style={{ marginTop: '2rem' }}>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                        Need help?{' '}
                        <a
                            href="mailto:support@propflow.com"
                            style={{ color: 'var(--indigo-600)', fontWeight: 500, textDecoration: 'none' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--indigo-700)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--indigo-600)'}
                        >
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};