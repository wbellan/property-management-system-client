import React from 'react';
import { Wrench, AlertCircle, Clock, CheckCircle, User } from 'lucide-react';

interface MaintenanceDashboardProps {
    metrics: any;
    user: any;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ metrics, user }) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                borderRadius: '1.5rem',
                padding: '2rem',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Maintenance Dashboard
                </h1>
                <p style={{ opacity: 0.9 }}>
                    {metrics?.assignments?.total || 0} active assignments
                </p>
            </div>

            {/* Priority Assignments */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="dashboard-card" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <AlertCircle size={24} color="white" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
                        {metrics?.assignments?.emergency || 0}
                    </div>
                    <p style={{ fontWeight: 600, color: '#111827' }}>Emergency</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Immediate attention required
                    </p>
                </div>

                <div className="dashboard-card" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Clock size={24} color="white" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
                        {metrics?.assignments?.high || 0}
                    </div>
                    <p style={{ fontWeight: 600, color: '#111827' }}>High Priority</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Complete within 24 hours
                    </p>
                </div>

                <div className="dashboard-card" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <CheckCircle size={24} color="white" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
                        {metrics?.performance?.completed || 0}
                    </div>
                    <p style={{ fontWeight: 600, color: '#111827' }}>Completed</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        This month
                    </p>
                </div>

                <div className="dashboard-card" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Wrench size={24} color="white" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '0.5rem' }}>
                        {metrics?.performance?.inProgress || 0}
                    </div>
                    <p style={{ fontWeight: 600, color: '#111827' }}>In Progress</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Currently working
                    </p>
                </div>
            </div>

            {/* Active Work Orders */}
            {metrics?.workOrders && metrics.workOrders.length > 0 && (
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Active Work Orders</h3>
                        <span style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem'
                        }}>
                            {metrics.workOrders.length} total
                        </span>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {metrics.workOrders.slice(0, 8).map((order, index) => (
                            <div key={index} style={{
                                padding: '1.25rem',
                                background: '#f9fafb',
                                borderRadius: '0.75rem',
                                borderLeft: `4px solid ${order.priority === 'EMERGENCY' ? '#ef4444' :
                                        order.priority === 'HIGH' ? '#f59e0b' :
                                            order.priority === 'MEDIUM' ? '#3b82f6' : '#6b7280'
                                    }`,
                                transition: 'all 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>
                                            {order.title}
                                        </h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                            <span>{order.property}</span>
                                            <span>•</span>
                                            <span>{order.unit}</span>
                                            <span>•</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            background: order.priority === 'EMERGENCY' ? '#fee2e2' :
                                                order.priority === 'HIGH' ? '#fef3c7' :
                                                    order.priority === 'MEDIUM' ? '#dbeafe' : '#f3f4f6',
                                            color: order.priority === 'EMERGENCY' ? '#991b1b' :
                                                order.priority === 'HIGH' ? '#92400e' :
                                                    order.priority === 'MEDIUM' ? '#1e40af' : '#374151'
                                        }}>
                                            {order.priority}
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            background: order.status === 'IN_PROGRESS' ? '#dbeafe' : '#fef3c7',
                                            color: order.status === 'IN_PROGRESS' ? '#1e40af' : '#92400e'
                                        }}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard-card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                        <CheckCircle size={20} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Update Status</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Mark work orders as complete</div>
                    </button>

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
                        <User size={20} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Request Help</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Get assistance from supervisor</div>
                    </button>

                    <button style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
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
                        <Clock size={20} style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Log Time</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Track work hours</div>
                    </button>
                </div>
            </div>
        </div>
    );
};