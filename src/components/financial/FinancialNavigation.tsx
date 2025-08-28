// src/components/financial/FinancialNavigation.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    BarChart3,
    FileText,
    CreditCard,
    ArrowLeft
} from 'lucide-react';

interface FinancialNavigationProps {
    onBackToDashboard?: () => void;
}

const FinancialNavigation: React.FC<FinancialNavigationProps> = ({
    onBackToDashboard
}) => {
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
        }
    ];

    return (
        <div className="financial-navigation mb-8">
            {/* Header with back button */}
            <div className="flex items-center mb-8">
                {onBackToDashboard && (
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 mr-4 text-white"
                        title="Back to Main Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h1 className="text-3xl font-bold text-white">Financial Management</h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`
                flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-white text-gray-800 shadow-lg'
                                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                                }
              `}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default FinancialNavigation;