import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
    BarChart3,
    FileText,
    CreditCard,
    DollarSign,
    Receipt,
    PieChart
} from 'lucide-react';

// Import all financial components
import FinancialDashboard from '../../components/financial/dashboard/FinancialDashboard';
import InvoiceManagement from '../../components/financial/invoices/InvoiceManagement';
import PaymentApplicationInterface from '../../components/financial/payments/PaymentApplicationInterface';
import BankReconciliation from '../../components/financial/bank-reconciliation/BankReconciliation';
import ExpenseManagement from '../../components/financial/expenses/ExpenseManagement';
import FinancialReports from '../../components/financial/reports/FinancialReports';

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
            icon: DollarSign
        },
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
    ];

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Financial Sub-Navigation */}
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', marginBottom: '1rem' }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (location.pathname === '/financials' && item.path === '/financials/dashboard');

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
                                background: isActive
                                    ? 'white'
                                    : 'rgba(255, 255, 255, 0.2)',
                                color: isActive
                                    ? '#1f2937'
                                    : '#374151',
                                backdropFilter: 'blur(4px)',
                                boxShadow: isActive
                                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    : 'none'
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
                <Route index element={<FinancialDashboard />} />
                <Route path="dashboard" element={<FinancialDashboard />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="payments" element={<PaymentApplicationInterface />} />
                <Route path="reconciliation" element={<BankReconciliation />} />
                <Route path="expenses" element={<ExpenseManagement />} />
                <Route path="reports" element={<FinancialReports />} />
            </Routes>
        </div>
    );
};

export default FinancialsPage;