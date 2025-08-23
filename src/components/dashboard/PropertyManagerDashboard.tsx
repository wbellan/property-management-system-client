import React from 'react';
import { Home, DollarSign, Wrench, Calendar, TrendingUp } from 'lucide-react';

interface PropertyManagerDashboardProps {
    metrics: any;
    user: any;
}

export const PropertyManagerDashboard: React.FC<PropertyManagerDashboardProps> = ({ metrics, user }) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '1.5rem',
                padding: '2rem',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Property Operations
                </h1>
                <p style={{ opacity: 0.9 }}>
                    Managing {metrics?.assignedProperties || 0} properties with {metrics?.occupancy?.totalSpaces || 0} total units
                </p>
            </div>

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-green">
                            <Home size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        {metrics?.occupancy?.rate || 0}%
                    </h3>
                    <p className="dashboard-metric-label">Occupancy Rate</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        {metrics?.occupancy?.occupiedSpaces || 0} of {metrics?.occupancy?.totalSpaces || 0} units occupied
                    </p>
                </div>

                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-blue">
                            <DollarSign size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        ${(metrics?.financial?.monthlyRevenue || 0).toLocaleString()}
                    </h3>
                    <p className="dashboard-metric-label">Monthly Revenue</p>
                </div>

                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-orange">
                            <Wrench size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        {metrics?.maintenance?.openTasks || 0}
                    </h3>
                    <p className="dashboard-metric-label">Open Maintenance</p>
                    {metrics?.maintenance?.emergency > 0 && (
                        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            {metrics.maintenance.emergency} emergency requests
                        </p>
                    )}
                </div>

                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-purple">
                            <Calendar size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        {metrics?.leases?.expiring || 0}
                    </h3>
                    <p className="dashboard-metric-label">Expiring Leases</p>
                </div>
            </div>

            {/* Properties Performance */}
            {metrics?.properties && (
                <div className="dashboard-card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Property Performance</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {metrics.properties.map((property, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{property.name}</h4>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                        {property.occupiedSpaces}/{property.totalSpaces} occupied •
                                        {Math.round((property.occupiedSpaces / property.totalSpaces) * 100)}% occupancy
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                                        ${property.monthlyRevenue?.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        monthly revenue
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};