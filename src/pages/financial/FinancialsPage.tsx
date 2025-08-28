// src/pages/financial/FinancialsPage.tsx (With Navigation)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, FileText, CreditCard, Building2, Receipt, TrendingUp } from 'lucide-react';
import {
    FinancialDashboard,
    InvoiceManagement,
    PaymentApplicationInterface
} from '../../components/financial';
import BankReconciliation from '../../components/financial/BankReconciliation';
import ExpenseManagement from '../../components/financial/ExpenseManagement';
import FinancialReports from '../../components/financial/FinancialReports';

const FinancialsPage: React.FC = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/financials/dashboard',
            label: 'Dashboard',
            icon: BarChart3
        },
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
            icon: Building2
        },
        {
            path: '/financials/expenses',
            label: 'Expenses',
            icon: Receipt
        },
        {
            path: '/financials/reports',
            label: 'Reports',
            icon: TrendingUp
        }
    ];

    return (
        <div className="space-y-6">
            {/* Financial Sub-Navigation */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                                ...(isActive
                                    ? {
                                        background: 'white',
                                        color: '#1f2937',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                    : {
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(4px)',
                                        // color: 'white'
                                    }
                                )
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                }
                            }}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>

            {/* Page Content */}
            <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FinancialDashboard />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="payments" element={<PaymentApplicationInterface />} />
                <Route path="reconciliation" element={<BankReconciliation />} />
                <Route path="expenses" element={<ExpenseManagement />} />
                <Route path="reports" element={<FinancialReports />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </div>
    );
};

export default FinancialsPage;