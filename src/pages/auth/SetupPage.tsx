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
        <div className="min-h-screen bg-gradient flex items-center justify-center" style={{ padding: '1rem' }}>
            <div className="w-full" style={{ maxWidth: '48rem' }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div className="welcome-card" style={{ marginBottom: 0, borderRadius: 0 }}>
                        <div className="welcome-content text-center">
                            <div className="icon-container">
                                <Building2 style={{ width: '2rem', height: '2rem', color: 'white' }} />
                            </div>
                            <h1 className="welcome-title">Welcome to PropFlow</h1>
                            <p className="welcome-subtitle">Let's set up your property management organization</p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div style={{ padding: '1.5rem 2rem', background: 'rgba(249, 250, 251, 0.5)' }}>
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: currentStep > step.id
                                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                                : currentStep === step.id
                                                    ? 'linear-gradient(135deg, var(--indigo-500), var(--purple-600))'
                                                    : '#e5e7eb',
                                            color: currentStep >= step.id ? 'white' : '#9ca3af',
                                            boxShadow: currentStep >= step.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            {currentStep > step.id ? (
                                                <Check style={{ width: '1.5rem', height: '1.5rem' }} />
                                            ) : (
                                                <step.icon style={{ width: '1.5rem', height: '1.5rem' }} />
                                            )}
                                        </div>
                                        <div style={{ display: 'none' }} className="desktop-only">
                                            <p style={{
                                                fontWeight: 500,
                                                color: currentStep >= step.id ? 'var(--indigo-600)' : '#9ca3af'
                                            }}>{step.title}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div style={{
                                            flex: 1,
                                            height: '2px',
                                            margin: '0 1rem',
                                            background: currentStep > step.id ? 'linear-gradient(135deg, #10b981, #059669)' : '#e5e7eb',
                                            transition: 'all 0.2s ease'
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                        {error && (
                            <div className="error-message mb-6">
                                {error}
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                                        Organization Details
                                    </h2>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        What's the name of your property management company?
                                    </p>
                                </div>

                                <div>
                                    <label className="form-label">
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
                                        className="form-input"
                                        placeholder="Acme Property Management"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                                        This will be displayed throughout the system and in emails to tenants.
                                    </p>
                                </div>

                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem'
                                }}>
                                    <h4 style={{ fontWeight: 500, color: '#1e40af', marginBottom: '0.5rem' }}>What's next?</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#1d4ed8' }}>
                                        After setting up your organization, you'll create your admin account and optionally
                                        add your first property-owning entity (like an LLC or individual owner).
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                                        Admin Account
                                    </h2>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        Create your administrator account for {formData.organizationName}
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="form-label">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.adminUser.firstName}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, firstName: e.target.value }
                                            })}
                                            className="form-input"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.adminUser.lastName}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, lastName: e.target.value }
                                            })}
                                            className="form-input"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.adminUser.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            adminUser: { ...formData.adminUser, email: e.target.value }
                                        })}
                                        className="form-input"
                                        placeholder="admin@yourcompany.com"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                                        This will be your login email and receive system notifications.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="form-label">Password *</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={formData.adminUser.password}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, password: e.target.value }
                                            })}
                                            className="form-input"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Confirm Password *</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.adminUser.confirmPassword}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                adminUser: { ...formData.adminUser, confirmPassword: e.target.value }
                                            })}
                                            className="form-input"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem'
                                }}>
                                    <h4 style={{ fontWeight: 500, color: '#92400e', marginBottom: '0.5rem' }}>Security Requirements</h4>
                                    <ul style={{ fontSize: '0.875rem', color: '#a16207', margin: 0, paddingLeft: '1rem' }}>
                                        <li>Password must be at least 8 characters long</li>
                                        <li>Use a strong, unique password</li>
                                        <li>Consider using a password manager</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                                        Initial Entity
                                    </h2>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        Create your first property owning entity (optional)
                                    </p>
                                </div>

                                <div>
                                    <label className="form-label">Entity Name</label>
                                    <input
                                        type="text"
                                        value={formData.initialEntity.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            initialEntity: { ...formData.initialEntity, name: e.target.value }
                                        })}
                                        className="form-input"
                                        placeholder="Main Street Properties LLC"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                                        Leave blank to skip and add entities later.
                                    </p>
                                </div>

                                <div>
                                    <label className="form-label">Entity Type</label>
                                    <select
                                        value={formData.initialEntity.entityType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            initialEntity: { ...formData.initialEntity, entityType: e.target.value }
                                        })}
                                        className="form-input"
                                    >
                                        <option value="LLC">Limited Liability Company (LLC)</option>
                                        <option value="Corporation">Corporation</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Trust">Trust</option>
                                    </select>
                                </div>

                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem'
                                }}>
                                    <h4 style={{ fontWeight: 500, color: '#1e40af', marginBottom: '0.5rem' }}>What's an entity?</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#1d4ed8' }}>
                                        Entities are the legal structures that own your properties (like LLCs, corporations,
                                        or individuals). Each entity can have its own bank accounts, chart of accounts, and
                                        financial reporting. You can add more entities later from the dashboard.
                                    </p>
                                </div>

                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem'
                                }}>
                                    <h4 style={{ fontWeight: 500, color: '#047857', marginBottom: '0.5rem' }}>Ready to Launch! 🚀</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.5rem' }}>
                                        Once you complete setup, you'll have access to your PropFlow dashboard where you can:
                                    </p>
                                    <ul style={{ fontSize: '0.875rem', color: '#059669', margin: 0, paddingLeft: '1rem' }}>
                                        <li>Add properties and units</li>
                                        <li>Invite team members</li>
                                        <li>Set up tenant management</li>
                                        <li>Configure financial tracking</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between" style={{ paddingTop: '2rem' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentStep === 1) {
                                        navigate('/login');
                                    } else {
                                        setCurrentStep(currentStep - 1);
                                    }
                                }}
                                className="btn btn-secondary flex items-center"
                            >
                                <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
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
                                    className="btn btn-primary flex items-center"
                                    style={
                                        (currentStep === 1 && !canProceedFromStep1) ||
                                            (currentStep === 2 && !canProceedFromStep2)
                                            ? { opacity: 0.5, cursor: 'not-allowed' }
                                            : {}
                                    }
                                >
                                    Continue
                                    <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn flex items-center"
                                    style={loading
                                        ? {
                                            background: 'rgba(16, 185, 129, 0.7)',
                                            color: 'white',
                                            opacity: 0.7,
                                            cursor: 'not-allowed'
                                        }
                                        : {
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }
                                    }
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner" style={{
                                                width: '1rem',
                                                height: '1rem',
                                                marginRight: '0.5rem',
                                                borderWidth: '2px'
                                            }}></div>
                                            Creating Organization...
                                        </>
                                    ) : (
                                        <>
                                            <Check style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                                            Complete Setup
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <div className="text-center" style={{ marginTop: '2rem' }}>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                        Need help? Contact support at{' '}
                        <a
                            href="mailto:support@propflow.com"
                            style={{ color: 'var(--indigo-600)', fontWeight: 500, textDecoration: 'none' }}
                            onMouseOver={(e) => e.target.style.color = 'var(--indigo-700)'}
                            onMouseOut={(e) => e.target.style.color = 'var(--indigo-600)'}
                        >
                            support@propflow.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};