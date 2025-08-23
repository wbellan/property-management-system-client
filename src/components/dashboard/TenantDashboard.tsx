import React from 'react';
import { Home, CreditCard, Wrench, Calendar, Phone, Mail, MapPin } from 'lucide-react';

interface TenantDashboardProps {
    metrics: any;
    user: any;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ metrics, user }) => {
    if (metrics?.message) {
        return (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Home size={64} style={{ color: '#6b7280', margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Welcome to Your Portal</h2>
                <p style={{ color: '#6b7280' }}>{metrics.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                borderRadius: '1.5rem',
                padding: '2rem',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Welcome Home
                </h1>
                <p style={{ opacity: 0.9, fontSize: '1.125rem' }}>
                    {metrics?.lease?.property} - {metrics?.lease?.unit}
                </p>
                {metrics?.lease?.daysUntilExpiry && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        background: metrics.lease.daysUntilExpiry < 90 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.75rem',
                        display: 'inline-block'
                    }}>
                        <span style={{ fontWeight: 600 }}>
                            {metrics.lease.daysUntilExpiry} days until lease expires
                        </span>
                    </div>
                )}
            </div>

            {/* Key Information Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Lease Information */}
                <div className="dashboard-card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <Home size={20} style={{ marginRight: '0.5rem', color: '#8b5cf6' }} />
                        Lease Information
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>Property:</span>
                            <span style={{ fontWeight: 600 }}>{metrics?.lease?.property}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>Unit:</span>
                            <span style={{ fontWeight: 600 }}>{metrics?.lease?.unit}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>Monthly Rent:</span>
                            <span style={{ fontWeight: 600, fontSize: '1.125rem', color: '#059669' }}>
                                ${metrics?.lease?.monthlyRent?.toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>Lease Expires:</span>
                            <span style={{ fontWeight: 600 }}>
                                {metrics?.lease?.leaseEnd ? new Date(metrics.lease.leaseEnd).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="dashboard-card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <CreditCard size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
                        Payment History
                    </h3>
                    {metrics?.payments?.recent?.length > 0 ? (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {metrics.payments.recent.slice(0, 4).map((payment, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem',
                                    background: '#f9fafb',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                                            ${payment.amount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {new Date(payment.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        background: payment.status === 'PAID' ? '#dcfce7' :
                                            payment.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                                        color: payment.status === 'PAID' ? '#166534' :
                                            payment.status === 'PENDING' ? '#92400e' : '#991b1b'
                                    }}>
                                        {payment.status}
                                    </span>
                                </div>
                            ))}
                            {metrics?.payments?.nextDue && (
                                <div style={{
                                    marginTop: '0.5rem',
                                    padding: '0.75rem',
                                    background: '#e0f2fe',
                                    borderRadius: '0.5rem',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ fontWeight: 600, color: '#0369a1' }}>
                                        Next payment due: {new Date(metrics.payments.nextDue).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
                            No payment history available
                        </p>
                    )}
                </div>
            </div>

            {/* Maintenance Requests */}
            {metrics?.maintenance?.recent?.length > 0 && (
                <div className="dashboard-card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <Wrench size={20} style={{ marginRight: '0.5rem', color: '#f59e0b' }} />
                        Recent Maintenance Requests
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {metrics.maintenance.recent.map((request, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#111827' }}>
                                        {request.title}
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    background: request.status === 'COMPLETED' ? '#dcfce7' :
                                        request.status === 'IN_PROGRESS' ? '#dbeafe' :
                                            request.status === 'OPEN' ? '#fef3c7' : '#f3f4f6',
                                    color: request.status === 'COMPLETED' ? '#166534' :
                                        request.status === 'IN_PROGRESS' ? '#1d4ed8' :
                                            request.status === 'OPEN' ? '#92400e' : '#374151'
                                }}>
                                    {request.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard-card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <button style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'transform 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Wrench size={20} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Request Maintenance</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Submit a new maintenance request</div>
                    </button>

                    <button style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'transform 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <CreditCard size={20} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Make Payment</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Pay rent or submit payment</div>
                    </button>

                    <button style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'transform 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Phone size={20} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Contact Management</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Get in touch with property team</div>
                    </button>
                </div>
            </div>

            {/* Contact Information */}
            <div className="dashboard-card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Property Contact</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Phone size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontWeight: 500 }}>Emergency: (555) 123-4567</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Mail size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontWeight: 500 }}>management@{metrics?.lease?.property?.toLowerCase().replace(/\s+/g, '') || 'property'}.com</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontWeight: 500 }}>Office Hours: Mon-Fri 9AM-5PM</span>
                    </div>
                </div>
            </div>
        </div>
    );
};