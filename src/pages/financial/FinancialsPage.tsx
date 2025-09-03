// src/pages/financial/FinancialsPage.tsx
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
    ChevronRight,
    Building2,
    BookOpen,
    PlusCircle,
    Wallet,
    ListChecks
} from 'lucide-react';

import PaymentDashboard from '../../components/financial/banking/PaymentDashboard';
import {
    BankingManagementInterface,
    ChartOfAccountsManager,
    FinancialDashboard,
    InvoiceManagement,
    LedgerEntryManager,
    PaymentApplicationInterface,
    PaymentRecordingInterface
} from '../../components/financial';
import FinancialReports from '../../components/financial/reports/FinancialReports';
import BankReconciliation from '../../components/financial/bank-reconciliation/BankReconciliation';
import { AutomatedPaymentProcessing } from '../../components/financial/payments';
import LateFeeManagement from '../../components/financial/late-fees/LateFeeManagement';
import ExpenseManagement from '../../components/financial/expenses/ExpenseManagement';
import CheckRegister from '../../components/financial/banking/CheckRegister';

const FinancialsPage: React.FC = () => {
    const location = useLocation();

    // Enhanced navigation with new banking features integrated
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
            label: 'Banking', // NEW SECTION
            items: [
                {
                    path: '/financials/bank-accounts',
                    label: 'Bank Accounts',
                    icon: Building2
                },
                {
                    path: '/financials/check-registers',
                    label: 'Check Registers',
                    icon: ListChecks
                },
                {
                    path: '/financials/payment-recording',
                    label: 'Record Payments',
                    icon: PlusCircle
                },
                {
                    path: '/financials/payment-dashboard',
                    label: 'Payment Management',
                    icon: Wallet
                },
                {
                    path: '/financials/chart-accounts',
                    label: 'Chart of Accounts',
                    icon: BookOpen
                },
                {
                    path: '/financials/ledger-entries',
                    label: 'Ledger Entries',
                    icon: FileText
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
                    label: 'Payment Matching',
                    icon: CreditCard
                },
                {
                    path: '/financials/reconciliation',
                    label: 'Bank Reconciliation',
                    icon: RefreshCw
                }
            ]
        },
        {
            label: 'Operations',
            items: [
                {
                    path: '/financials/automation',
                    label: 'Payment Automation',
                    icon: RefreshCw
                },
                {
                    path: '/financials/late-fees',
                    label: 'Late Fee Management',
                    icon: AlertTriangle
                },
                {
                    path: '/financials/expenses',
                    label: 'Expense Management',
                    icon: Receipt
                }
            ]
        },
        {
            label: 'Reporting',
            items: [
                {
                    path: '/financials/reports',
                    label: 'Financial Reports',
                    icon: PieChart
                }
            ]
        }
    ];

    const getCurrentPath = () => {
        if (location.pathname === '/financials') return '/financials/dashboard';
        return location.pathname;
    };

    const activePath = getCurrentPath();

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0f2fe 100%)'
        }}>
            {/* Existing Compact Sidebar Navigation */}
            <div style={{
                width: '200px',
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
                                                    ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                                                    : 'none',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                width: '14px',
                                                height: '14px'
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

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                minWidth: 0,
                overflow: 'auto'
            }}>
                <Routes>
                    <Route index element={<FinancialDashboard />} />
                    <Route path="dashboard" element={<FinancialDashboard />} />

                    {/* Existing Routes */}
                    <Route path="invoices" element={<InvoiceManagement />} />
                    <Route path="payments" element={<PaymentApplicationInterface />} />
                    <Route path="reconciliation" element={<BankReconciliation />} />
                    <Route path="automation" element={<AutomatedPaymentProcessing />} />
                    <Route path="late-fees" element={<LateFeeManagement />} />
                    <Route path="expenses" element={<ExpenseManagement />} />
                    <Route path="reports" element={<FinancialReports />} />

                    {/* NEW Banking Routes */}
                    <Route path="bank-accounts" element={<BankingManagementInterface />} />
                    <Route path="chart-accounts" element={<ChartOfAccountsManager />} />
                    <Route path="ledger-entries" element={<LedgerEntryManager />} />
                    <Route path="payment-recording" element={<PaymentRecordingInterface />} />
                    <Route path="payment-dashboard" element={<PaymentDashboard />} />
                    <Route path="check-registers" element={<CheckRegister />} />
                </Routes>
            </div>
        </div>
    );
};

export default FinancialsPage;