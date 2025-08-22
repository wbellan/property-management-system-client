// src/pages/auth/AcceptInvitationPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { invitationService, type InvitationDetails } from '../../services/api/invitationService';

export const AcceptInvitationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    useEffect(() => {
        if (!token) {
            setError('Invalid invitation link');
            setLoading(false);
            return;
        }

        validateInvitation();
    }, [token]);

    const validateInvitation = async () => {
        try {
            const response = await invitationService.validateInvitation(token!);
            setInvitation(response.data);
        } catch (err: any) {
            setError(err.message || 'Invalid or expired invitation');
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return errors;
    };

    const handlePasswordChange = (password: string) => {
        setFormData(prev => ({ ...prev, password }));
        setPasswordErrors(validatePassword(password));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !invitation) {
            setError('Invalid invitation');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordErrors.length > 0) {
            setError('Please fix password requirements');
            return;
        }

        setCreating(true);
        setError(null);

        try {
            await invitationService.completeInvitation({
                token,
                password: formData.password
            });

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Account created successfully! Please log in with your new credentials.',
                        email: invitation.email
                    }
                });
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setCreating(false);
        }
    };

    const formatRole = (role: string) => {
        const roleNames: Record<string, string> = {
            'SUPER_ADMIN': 'Super Administrator',
            'ORG_ADMIN': 'Organization Administrator',
            'ENTITY_MANAGER': 'Entity Manager',
            'PROPERTY_MANAGER': 'Property Manager',
            'TENANT': 'Tenant',
            'MAINTENANCE': 'Maintenance Staff',
            'ACCOUNTANT': 'Accountant',
        };
        return roleNames[role] || role;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <div className="card animate-fade-in">
                    <div className="text-center">
                        <div className="loading-spinner"></div>
                        <p className="subtitle">Validating invitation...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <div className="card animate-fade-in">
                    <div className="text-center">
                        <div className="icon-container" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                            <AlertCircle />
                        </div>
                        <h1 className="title">Invalid Invitation</h1>
                        <p className="subtitle mb-6">{error}</p>
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
                <div className="card animate-fade-in">
                    <div className="text-center">
                        <div className="icon-container" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <CheckCircle />
                        </div>
                        <h1 className="title">Account Created!</h1>
                        <p className="subtitle mb-6">
                            Your account has been successfully created. You will be redirected to the login page shortly.
                        </p>
                        <div className="text-center" style={{ color: 'var(--indigo-600)', fontSize: '0.875rem' }}>
                            <div className="loading-spinner" style={{ margin: '0 auto 0.5rem auto', width: '1.5rem', height: '1.5rem' }}></div>
                            Redirecting to login...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient flex items-center justify-center">
            <div className="w-full" style={{ maxWidth: '32rem', padding: '1rem' }}>
                <div className="card animate-fade-in" style={{ padding: '2rem' }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="icon-container">
                            <Building2 />
                        </div>
                        <h1 className="title">Complete Your Invitation</h1>
                        <p className="subtitle">Set up your account to get started</p>
                    </div>

                    {/* Invitation Details */}
                    {invitation && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(124, 58, 237, 0.1))',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            border: '1px solid rgba(102, 126, 234, 0.2)'
                        }}>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: 'var(--gray-900)',
                                marginBottom: '1rem'
                            }}>
                                Invitation Details
                            </h3>
                            <div className="space-y-3">
                                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <strong>Name:</strong> {invitation.firstName} {invitation.lastName}
                                </div>
                                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <strong>Email:</strong> {invitation.email}
                                </div>
                                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <strong>Organization:</strong> {invitation.organizationName}
                                </div>
                                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <strong>Role:</strong>
                                    <span style={{
                                        marginLeft: '0.5rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--indigo-600)'
                                    }}>
                                        {formatRole(invitation.role)}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem' }}>
                                    <strong>Expires:</strong> {new Date(invitation.expiresAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="form-label">Create Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter secure password"
                                    required
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            {formData.password && (
                                <div style={{ marginTop: '0.75rem' }}>
                                    {passwordErrors.map((error, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '0.75rem',
                                            color: '#dc2626',
                                            marginBottom: '0.25rem'
                                        }}>
                                            <AlertCircle style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                            {error}
                                        </div>
                                    ))}
                                    {passwordErrors.length === 0 && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '0.75rem',
                                            color: '#059669'
                                        }}>
                                            <CheckCircle style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                            Password meets all requirements
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="form-label">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    required
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
                                </button>
                            </div>

                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.75rem',
                                    color: '#dc2626',
                                    marginTop: '0.5rem'
                                }}>
                                    <AlertCircle style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                    Passwords do not match
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={creating || passwordErrors.length > 0 || formData.password !== formData.confirmPassword}
                            className={`btn btn-primary ${creating || passwordErrors.length > 0 || formData.password !== formData.confirmPassword ? 'btn-loading' : ''}`}
                        >
                            {creating ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="loading-spinner" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="demo-credentials">
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--indigo-600)',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};