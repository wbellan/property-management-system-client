// src/components/financial/FinancialLayoutWrapper.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FinancialNavigation from './FinancialNavigation';

interface FinancialLayoutWrapperProps {
    children: React.ReactNode;
}

const FinancialLayoutWrapper: React.FC<FinancialLayoutWrapperProps> = ({
    children
}) => {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Financial Navigation */}
                <FinancialNavigation onBackToDashboard={handleBackToDashboard} />

                {/* Page Content */}
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FinancialLayoutWrapper;