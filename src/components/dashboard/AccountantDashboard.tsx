import React from 'react';
import { TrendingUp, DollarSign, CreditCard, AlertCircle } from 'lucide-react';

interface AccountantDashboardProps {
    metrics: any;
    user: any;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({ metrics, user }) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                borderRadius: '1.5rem',
                padding: '2rem',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Financial Dashboard
                </h1>
                <p style={{ opacity: 0.9 }}>
                    Financial oversight and accounting management
                </p>
            </div>

            {/* Financial Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-green">
                            <TrendingUp size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        ${(metrics?.financial?.monthlyRevenue || 0).toLocaleString()}
                    </h3>
                    <p className="dashboard-metric-label">Monthly Revenue</p>
                </div>

                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-red">
                            <DollarSign size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        ${(metrics?.financial?.monthlyExpenses || 0).toLocaleString()}
                    </h3>
                    <p className="dashboard-metric-label">Monthly Expenses</p>
                </div>

                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-purple">
                            <CreditCard size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        ${(metrics?.financial?.netIncome || 0).toLocaleString()}
                    </h3>
                    <p className="dashboard-metric-label">Net Income</p>
                </div>

                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="dashboard-icon dashboard-icon-orange">
                            <AlertCircle size={24} color="white" />
                        </div>
                    </div>
                    <h3 className="dashboard-metric-value">
                        {metrics?.financial?.outstandingInvoices || 0}
                    </h3>
                    <p className="dashboard-metric-label">Outstanding Invoices</p>
                </div>
            </div>

            {/* Financial Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="dashboard-card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Financial Performance</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: 500 }}>Gross Revenue</span>
                            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#059669' }}>
                                ${(metrics?.financial?.monthlyRevenue || 0).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: 500 }}>Total Expenses</span>
                            <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#dc2626' }}>
                                ${(metrics?.financial?.monthlyExpenses || 0).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f3e8ff', borderRadius: '0.5rem', borderTop: '2px solid #8b5cf6' }}>
                            <span style={{ fontWeight: 600 }}>Net Income</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7c3aed' }}>
                                ${(metrics?.financial?.netIncome || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Payment Activity</h3>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                            {metrics?.financial?.recentPayments || 0}
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Payments this week</p>
                    </div>
                </div>
            </div>
        </div>
    );
};