import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
    BarChart3,
    FileText,
    CreditCard,
    DollarSign,
    Receipt,
    PieChart,
    RefreshCw,
    AlertTriangle,
    ChevronRight
} from 'lucide-react';

// Import all financial components
import {
    InvoiceManagement,
    PaymentApplicationInterface,
    FinancialDashboard
} from '../../components/financial';

import BankReconciliation from '../../components/financial/bank-reconciliation/BankReconciliation';
import ExpenseManagement from '../../components/financial/expenses/ExpenseManagement';
import FinancialReports from '../../components/financial/reports/FinancialReports';
import AutomatedPaymentProcessing from '../../components/financial/payments/AutomatedPaymentProcessing';
import LateFeeManagement from '../../components/financial/late-fees/LateFeeManagement';

const FinancialsPage: React.FC = () => {
    const location = useLocation();

    // Organized navigation items into logical groups
    const navigationGroups = [
        {
            label: 'Overview',
            items: [
                {
                    path: '/financials/dashboard',
                    label: 'Dashboard',
                    icon: BarChart3
                }
            ]
        },
        {
            label: 'Transactions',
            items: [
                {
                    path: '/financials/invoices',
                    label: 'Invoices',
                    icon: FileText
                },
                {
                    path: '/financials/payments',
                    label: 'Payments',
                    icon: CreditCard
                },
                {
                    path: '/financials/reconciliation',
                    label: 'Reconciliation',
                    icon: DollarSign
                }
            ]
        },
        {
            label: 'Automation',
            items: [
                {
                    path: '/financials/automation',
                    label: 'Payment Automation',
                    icon: RefreshCw
                },
                {
                    path: '/financials/late-fees',
                    label: 'Late Fees',
                    icon: AlertTriangle
                }
            ]
        },
        {
            label: 'Analysis',
            items: [
                {
                    path: '/financials/expenses',
                    label: 'Expenses',
                    icon: Receipt
                },
                {
                    path: '/financials/reports',
                    label: 'Reports',
                    icon: PieChart
                }
            ]
        }
    ];

    // Get current active path
    const getCurrentPath = () => {
        if (location.pathname === '/financials') return '/financials/dashboard';
        return location.pathname;
    };

    const activePath = getCurrentPath();

    return (
        // Use full width like other main pages - no artificial constraints
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0f2fe 100%)'
        }}>
            {/* Compact Sidebar Navigation */}
            <div style={{
                width: '200px', // Compact sidebar
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
                flexShrink: 0,
                padding: '1rem',
                overflowY: 'auto'
            }}>
                {/* Sidebar Header */}
                <div style={{
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(229, 231, 235, 0.2)'
                }}>
                    <h2 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0,
                        marginBottom: '0.25rem'
                    }}>
                        Financial Management
                    </h2>
                    <p style={{
                        color: '#6b7280',
                        margin: 0,
                        fontSize: '0.7rem'
                    }}>
                        Operations & reporting
                    </p>
                </div>

                {/* Navigation Groups */}
                <div>
                    {navigationGroups.map((group, groupIndex) => (
                        <div key={group.label} style={{ marginBottom: '1rem' }}>
                            <h3 style={{
                                fontSize: '0.6rem',
                                fontWeight: '500',
                                color: '#9ca3af',
                                margin: '0 0 0.5rem 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                paddingLeft: '0.5rem'
                            }}>
                                {group.label}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activePath === item.path;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.6rem',
                                                padding: '0.4rem 0.6rem',
                                                borderRadius: '0.4rem',
                                                textDecoration: 'none',
                                                transition: 'all 0.15s ease',
                                                background: isActive
                                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                    : 'transparent',
                                                color: isActive ? 'white' : '#4b5563',
                                                boxShadow: isActive
                                                    ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                                                    : 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background = 'rgba(249, 250, 251, 0.8)';
                                                    e.currentTarget.style.color = '#111827';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#4b5563';
                                                }
                                            }}
                                        >
                                            <div style={{
                                                width: '1.2rem',
                                                height: '1.2rem',
                                                borderRadius: '0.3rem',
                                                background: isActive
                                                    ? 'rgba(255, 255, 255, 0.25)'
                                                    : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Icon size={12} style={{
                                                    color: isActive ? 'white' : '#6b7280'
                                                }} />
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: isActive ? '600' : '500',
                                                    lineHeight: '1.2',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {item.label}
                                                </div>
                                            </div>

                                            {isActive && (
                                                <ChevronRight size={10} style={{
                                                    color: 'white',
                                                    opacity: 0.8,
                                                    flexShrink: 0
                                                }} />
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area - Full width like other pages */}
            <div style={{
                flex: 1,
                minWidth: 0, // Critical for flex
                overflow: 'auto' // Allow content to scroll naturally
            }}>
                <Routes>
                    <Route index element={<FinancialDashboard />} />
                    <Route path="dashboard" element={<FinancialDashboard />} />
                    <Route path="invoices" element={<InvoiceManagement />} />
                    <Route path="payments" element={<PaymentApplicationInterface />} />
                    <Route path="reconciliation" element={<BankReconciliation />} />
                    <Route path="automation" element={<AutomatedPaymentProcessing />} />
                    <Route path="late-fees" element={<LateFeeManagement />} />
                    <Route path="expenses" element={<ExpenseManagement />} />
                    <Route path="reports" element={<FinancialReports />} />
                </Routes>
            </div>
        </div>
    );
};

export default FinancialsPage;