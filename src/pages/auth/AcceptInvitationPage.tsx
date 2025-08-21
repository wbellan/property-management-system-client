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
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
                    <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Validating invitation...</p>
                </div>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center max-w-md">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Created!</h1>
                    <p className="text-gray-600 mb-6">
                        Your account has been successfully created. You will be redirected to the login page shortly.
                    </p>
                    <div className="animate-pulse text-indigo-600">
                        Redirecting to login...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Complete Your Invitation
                            </h1>
                            <p className="text-gray-600">Set up your account to get started</p>
                        </div>

                        {/* Invitation Details */}
                        {invitation && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Invitation Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Name:</strong> {invitation.firstName} {invitation.lastName}</div>
                                    <div><strong>Email:</strong> {invitation.email}</div>
                                    <div><strong>Organization:</strong> {invitation.organizationName}</div>
                                    <div><strong>Role:</strong>
                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {formatRole(invitation.role)}
                                        </span>
                                    </div>
                                    <div><strong>Expires:</strong> {new Date(invitation.expiresAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        )}

                        {/* Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Create Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handlePasswordChange(e.target.value)}
                                        className="w-full px-4 py-4 bg-gray-50/50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400 pr-12"
                                        placeholder="Enter secure password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                {formData.password && (
                                    <div className="mt-2 space-y-1">
                                        {passwordErrors.map((error, index) => (
                                            <div key={index} className="flex items-center text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {error}
                                            </div>
                                        ))}
                                        {passwordErrors.length === 0 && (
                                            <div className="flex items-center text-xs text-green-600">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Password meets all requirements
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full px-4 py-4 bg-gray-50/50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400 pr-12"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <div className="flex items-center text-xs text-red-600 mt-1">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Passwords do not match
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={creating || passwordErrors.length > 0 || formData.password !== formData.confirmPassword}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? (
                                    <div className="flex items-center justify-center">
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
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