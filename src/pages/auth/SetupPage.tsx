import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api/apiService';

export const SetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        organizationName: '',
        adminUser: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        initialEntity: {
            name: '',
            entityType: 'LLC',
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.adminUser.password !== formData.adminUser.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.adminUser.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await apiService.request('/users/setup-organization', {
                method: 'POST',
                body: JSON.stringify({
                    organizationName: formData.organizationName,
                    adminUser: {
                        firstName: formData.adminUser.firstName,
                        lastName: formData.adminUser.lastName,
                        email: formData.adminUser.email,
                        password: formData.adminUser.password,
                    },
                    initialEntity: formData.initialEntity.name ? {
                        name: formData.initialEntity.name,
                        entityType: formData.initialEntity.entityType,
                    } : undefined,
                }),
            });

            // Redirect to success page or login
            navigate('/login?setup=success&email=' + encodeURIComponent(formData.adminUser.email));
        } catch (error: any) {
            console.error('Setup failed:', error);
            setError(error.message || 'Setup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            id: 1,
            title: 'Organization',
            icon: Building2,
            description: 'Basic company information'
        },
        {
            id: 2,
            title: 'Admin Account',
            icon: Users,
            description: 'Your administrator credentials'
        },
        {
            id: 3,
            title: 'Initial Entity',
            icon: Check,
            description: 'Optional: First property owner'
        },
    ];

    const canProceedFromStep1 = formData.organizationName.trim().length > 0;
    const canProceedFromStep2 =
        formData.adminUser.firstName.trim().length > 0 &&
        formData.adminUser.lastName.trim().length > 0 &&
        formData.adminUser.email.trim().length > 0 &&
        formData.adminUser.password.length >= 8 &&
        formData.adminUser.password === formData.adminUser.confirmPassword;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shadow-lg">
                                <Building2 className="w-8 h-8" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-2">Welcome to PropFlow</h1>
                        <p className="text-center text-white/80">Let's set up your property management organization</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-8 py-6 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep > step.id
                                                ? 'bg-green-500 text-white shadow-lg'
                                                : currentStep === step.id
                                                    ? 'bg-indigo-500 text-white shadow-lg'
                                                    : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            {currentStep > step.id ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <step.icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className={`font-medium ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
                                                }`}>{step.title}</p>
                                            <p className="text-xs text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 transition-all ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                                {error}
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Details</h2>
                                    <p className="text-gray-600">What's the name of your property management company?</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Organization Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.organizationName}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            organizationName: e.target.value
                                        })}
                                        className="w-full px-4 py-4 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                        placeholder="Acme Property Management"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This will be displayed throughout the system and in emails to tenants.
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">What's next?</h4>
                                    <p className="text-sm text-blue-800">
                                        After setting up your organization, you'll create your admin account and optionally
                                        add your first property-owning entity (like an LLC or individual owner).
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Account</h2>
                                    <p className="text-gray-600">Create your administrator account for {formData.organizationName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.adminUser.firstName}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, firstName: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.adminUser.lastName}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, lastName: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.adminUser.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            adminUser: { ...formData.adminUser, email: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                        placeholder="admin@yourcompany.com"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This will be your login email and receive system notifications.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={formData.adminUser.password}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, password: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.adminUser.confirmPassword}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, confirmPassword: e.target.value }
                                            })}
                                            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <h4 className="font-medium text-amber-900 mb-2">Security Requirements</h4>
                                    <ul className="text-sm text-amber-800 space-y-1">
                                        <li>• Password must be at least 8 characters long</li>
                                        <li>• Use a strong, unique password</li>
                                        <li>• Consider using a password manager</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Initial Entity</h2>
                                    <p className="text-gray-600">Create your first property owning entity (optional)</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Entity Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.initialEntity.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            initialEntity: { ...formData.initialEntity, name: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                        placeholder="Main Street Properties LLC"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave blank to skip and add entities later.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Entity Type
                                    </label>
                                    <select
                                        value={formData.initialEntity.entityType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            initialEntity: { ...formData.initialEntity, entityType: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    >
                                        <option value="LLC">Limited Liability Company (LLC)</option>
                                        <option value="Corporation">Corporation</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Trust">Trust</option>
                                    </select>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">What's an entity?</h4>
                                    <p className="text-sm text-blue-800">
                                        Entities are the legal structures that own your properties (like LLCs, corporations,
                                        or individuals). Each entity can have its own bank accounts, chart of accounts, and
                                        financial reporting. You can add more entities later from the dashboard.
                                    </p>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <h4 className="font-medium text-green-900 mb-2">Ready to Launch! 🚀</h4>
                                    <p className="text-sm text-green-800">
                                        Once you complete setup, you'll have access to your PropFlow dashboard where you can:
                                    </p>
                                    <ul className="text-sm text-green-800 mt-2 space-y-1">
                                        <li>• Add properties and units</li>
                                        <li>• Invite team members</li>
                                        <li>• Set up tenant management</li>
                                        <li>• Configure financial tracking</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between pt-8">
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentStep === 1) {
                                        navigate('/login');
                                    } else {
                                        setCurrentStep(currentStep - 1);
                                    }
                                }}
                                className="flex items-center px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {currentStep === 1 ? 'Back to Login' : 'Previous'}
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={
                                        (currentStep === 1 && !canProceedFromStep1) ||
                                        (currentStep === 2 && !canProceedFromStep2)
                                    }
                                    className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Organization...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Complete Setup
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 text-sm">
                        Need help? Contact support at{' '}
                        <a href="mailto:support@propflow.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            support@propflow.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};