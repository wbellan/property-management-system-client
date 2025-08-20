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

    const inviteToken = searchParams.get('token');

    useEffect(() => {
        if (!inviteToken) {
            setError('Invalid invitation link');
            return;
        }

        // You could optionally verify the token and get invitation details here
        // For now, we'll just validate the token exists
    }, [inviteToken]);

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
            const response = await apiService.request('/users/complete-invitation', {
                method: 'POST',
                body: JSON.stringify({
                    inviteToken,
                    password,
                }),
            });

            setSuccess(true);

            // Redirect after showing success message
            setTimeout(() => {
                navigate('/login?invitation=completed&email=' + encodeURIComponent(response.email || ''));
            }, 3000);
        } catch (error: any) {
            console.error('Failed to complete invitation:', error);
            setError(error.message || 'Failed to complete invitation. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Team! 🎉</h1>
                        <p className="text-gray-600 mb-6">
                            Your account has been activated successfully. You can now sign in and start using PropFlow.
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            <span className="text-sm">Redirecting to login...</span>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                            Go to login page now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Complete Your Invitation
                            </h1>
                            <p className="text-gray-600">Set your password to activate your PropFlow account</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-start">
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Create Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400 pr-12"
                                        placeholder="Choose a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-500">Password requirements:</p>
                                    <ul className="text-xs text-gray-500 space-y-0.5">
                                        <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}>
                                            <div className={`w-1 h-1 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            At least 8 characters long
                                        </li>
                                        <li className={`flex items-center ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 'text-green-600' : ''}`}>
                                            <div className={`w-1 h-1 rounded-full mr-2 ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            Include uppercase, lowercase, and number
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400 pr-12"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !password || password !== confirmPassword || validatePassword(password) !== null}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Activating Account...
                                    </>
                                ) : (
                                    <>
                                        Activate Account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                                <p className="text-sm text-blue-800">
                                    After activating your account, you'll be able to sign in and access your assigned
                                    areas of the PropFlow system. Your role and permissions have been configured by your administrator.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Need help?{' '}
                            <a href="mailto:support@propflow.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};