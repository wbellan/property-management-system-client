// src/pages/financials/FinancialsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Receipt,
    CreditCard,
    Banknote,
    FileText,
    Plus,
    Search,
    Filter,
    Download,
    Calendar,
    Building2,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    property?: {
        name: string;
    };
    tenant?: {
        name: string;
    };
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    reference?: string;
}

interface Account {
    id: string;
    name: string;
    type: 'CHECKING' | 'SAVINGS' | 'CREDIT';
    balance: number;
    lastUpdated: string;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    tenant: {
        name: string;
    };
    property: {
        name: string;
    };
    amount: number;
    dueDate: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    paidDate?: string;
}

export const FinancialsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockAccounts: Account[] = [
            {
                id: '1',
                name: 'Main Operating Account',
                type: 'CHECKING',
                balance: 45678.90,
                lastUpdated: '2024-08-24'
            },
            {
                id: '2',
                name: 'Security Deposits',
                type: 'SAVINGS',
                balance: 12500.00,
                lastUpdated: '2024-08-24'
            },
            {
                id: '3',
                name: 'Maintenance Reserve',
                type: 'SAVINGS',
                balance: 8750.00,
                lastUpdated: '2024-08-24'
            }
        ];

        const mockTransactions: Transaction[] = [
            {
                id: '1',
                date: '2024-08-24',
                description: 'Monthly Rent - Unit 2A',
                amount: 1200.00,
                type: 'INCOME',
                category: 'Rent',
                property: { name: 'Sunset Apartments' },
                tenant: { name: 'John Smith' },
                status: 'COMPLETED',
                reference: 'RNT-001'
            },
            {
                id: '2',
                date: '2024-08-23',
                description: 'Plumbing Repair - Unit 1B',
                amount: -285.50,
                type: 'EXPENSE',
                category: 'Maintenance',
                property: { name: 'Oak View Complex' },
                status: 'COMPLETED',
                reference: 'EXP-047'
            },
            {
                id: '3',
                date: '2024-08-22',
                description: 'Monthly Rent - Unit 3C',
                amount: 1100.00,
                type: 'INCOME',
                category: 'Rent',
                property: { name: 'Pine Ridge Homes' },
                tenant: { name: 'Michael Davis' },
                status: 'COMPLETED',
                reference: 'RNT-002'
            },
            {
                id: '4',
                date: '2024-08-21',
                description: 'Property Insurance Premium',
                amount: -1250.00,
                type: 'EXPENSE',
                category: 'Insurance',
                status: 'PENDING',
                reference: 'EXP-048'
            },
            {
                id: '5',
                date: '2024-08-20',
                description: 'Late Fee - Unit 1B',
                amount: 75.00,
                type: 'INCOME',
                category: 'Fees',
                property: { name: 'Oak View Complex' },
                tenant: { name: 'Sarah Johnson' },
                status: 'COMPLETED',
                reference: 'FEE-012'
            }
        ];

        const mockInvoices: Invoice[] = [
            {
                id: '1',
                invoiceNumber: 'INV-2024-001',
                tenant: { name: 'John Smith' },
                property: { name: 'Sunset Apartments' },
                amount: 1200.00,
                dueDate: '2024-09-01',
                status: 'PAID',
                paidDate: '2024-08-28'
            },
            {
                id: '2',
                invoiceNumber: 'INV-2024-002',
                tenant: { name: 'Sarah Johnson' },
                property: { name: 'Oak View Complex' },
                amount: 1425.00,
                dueDate: '2024-09-01',
                status: 'PENDING'
            },
            {
                id: '3',
                invoiceNumber: 'INV-2024-003',
                tenant: { name: 'Emily Wilson' },
                property: { name: 'Pine Ridge Homes' },
                amount: 1100.00,
                dueDate: '2024-08-15',
                status: 'OVERDUE'
            }
        ];

        setTimeout(() => {
            setAccounts(mockAccounts);
            setTransactions(mockTransactions);
            setInvoices(mockInvoices);
            setLoading(false);
        }, 1000);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'PAID':
                return { bg: '#dcfce7', color: '#166534' };
            case 'PENDING':
                return { bg: '#fef3c7', color: '#92400e' };
            case 'FAILED':
            case 'OVERDUE':
                return { bg: '#fef2f2', color: '#991b1b' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const monthlyIncome = transactions
        .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = transactions
        .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'ALL' || transaction.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const renderOverview = () => (
        <div className="overview-section">
            {/* Financial Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="card-header">
                        <div className="card-icon income">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3>Total Balance</h3>
                            <p className="card-amount income">{formatCurrency(totalBalance)}</p>
                        </div>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-header">
                        <div className="card-icon income">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h3>Monthly Income</h3>
                            <p className="card-amount income">{formatCurrency(monthlyIncome)}</p>
                        </div>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-header">
                        <div className="card-icon expense">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <h3>Monthly Expenses</h3>
                            <p className="card-amount expense">{formatCurrency(monthlyExpenses)}</p>
                        </div>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-header">
                        <div className="card-icon neutral">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h3>Net Income</h3>
                            <p className={`card-amount ${monthlyIncome - monthlyExpenses >= 0 ? 'income' : 'expense'}`}>
                                {formatCurrency(monthlyIncome - monthlyExpenses)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bank Accounts */}
            <div className="section-card">
                <div className="section-header">
                    <h3>Bank Accounts</h3>
                    <button className="btn-secondary">
                        <Plus size={16} />
                        Add Account
                    </button>
                </div>
                <div className="accounts-grid">
                    {accounts.map(account => (
                        <div key={account.id} className="account-card">
                            <div className="account-header">
                                <div className="account-icon">
                                    <Banknote size={20} />
                                </div>
                                <div>
                                    <h4>{account.name}</h4>
                                    <p className="account-type">{account.type}</p>
                                </div>
                            </div>
                            <div className="account-balance">
                                {formatCurrency(account.balance)}
                            </div>
                            <div className="account-updated">
                                Last updated: {formatDate(account.lastUpdated)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section-card">
                <div className="section-header">
                    <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions">
                    <button className="action-btn">
                        <Plus size={16} />
                        Record Payment
                    </button>
                    <button className="action-btn">
                        <FileText size={16} />
                        Create Invoice
                    </button>
                    <button className="action-btn">
                        <Receipt size={16} />
                        Add Expense
                    </button>
                    <button className="action-btn">
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTransactions = () => (
        <div className="transactions-section">
            <div className="filters-row">
                <div className="filters-left">
                    <div className="search-box">
                        <Search className="search-icon" size={16} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="INCOME">Income Only</option>
                        <option value="EXPENSE">Expenses Only</option>
                    </select>
                </div>
                <button className="btn-primary">
                    <Plus size={16} />
                    Add Transaction
                </button>
            </div>

            <div className="transactions-list">
                {filteredTransactions.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                        <div className="transaction-main">
                            <div className="transaction-icon">
                                {transaction.type === 'INCOME' ? (
                                    <TrendingUp size={20} className="icon-income" />
                                ) : (
                                    <TrendingDown size={20} className="icon-expense" />
                                )}
                            </div>
                            <div className="transaction-details">
                                <h4>{transaction.description}</h4>
                                <div className="transaction-meta">
                                    <span className="category">{transaction.category}</span>
                                    {transaction.property && (
                                        <>
                                            <span className="separator">•</span>
                                            <span className="property">{transaction.property.name}</span>
                                        </>
                                    )}
                                    {transaction.tenant && (
                                        <>
                                            <span className="separator">•</span>
                                            <span className="tenant">{transaction.tenant.name}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="transaction-right">
                            <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                                {transaction.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                            </div>
                            <div className="transaction-status">
                                <span
                                    className="status-badge"
                                    style={getStatusColor(transaction.status)}
                                >
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="transaction-date">
                                {formatDate(transaction.date)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInvoices = () => (
        <div className="invoices-section">
            <div className="section-header">
                <h3>Recent Invoices</h3>
                <button className="btn-primary">
                    <Plus size={16} />
                    Create Invoice
                </button>
            </div>

            <div className="invoices-list">
                {invoices.map(invoice => (
                    <div key={invoice.id} className="invoice-item">
                        <div className="invoice-main">
                            <div className="invoice-number">
                                {invoice.invoiceNumber}
                            </div>
                            <div className="invoice-details">
                                <h4>{invoice.tenant.name}</h4>
                                <p>{invoice.property.name}</p>
                            </div>
                        </div>
                        <div className="invoice-right">
                            <div className="invoice-amount">
                                {formatCurrency(invoice.amount)}
                            </div>
                            <div className="invoice-status">
                                <span
                                    className="status-badge"
                                    style={getStatusColor(invoice.status)}
                                >
                                    {invoice.status}
                                </span>
                            </div>
                            <div className="invoice-due">
                                Due: {formatDate(invoice.dueDate)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading financial data...</p>
            </div>
        );
    }

    return (
        <div className="financials-page">
            <style>{`
        .financials-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .page-subtitle {
          color: #6b7280;
          margin: 0;
        }

        .tabs-nav {
          display: flex;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          gap: 0.5rem;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #6b7280;
        }

        .tab-btn.active {
          background: #6366f1;
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: #f3f4f6;
          color: #374151;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .card-icon.income {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .card-icon.expense {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .card-icon.neutral {
          background: linear-gradient(135deg, #6366f1 0%, #5856eb 100%);
        }

        .card-header h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          margin: 0;
        }

        .card-amount {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .card-amount.income {
          color: #059669;
        }

        .card-amount.expense {
          color: #dc2626;
        }

        .section-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #5856eb;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .account-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .account-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .account-icon {
          background: #6366f1;
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .account-header h4 {
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .account-type {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
          text-transform: capitalize;
        }

        .account-balance {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .account-updated {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #374151;
        }

        .action-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filters-left {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
        }

        .transactions-list,
        .invoices-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transaction-item,
        .invoice-item {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .transaction-main,
        .invoice-main {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .transaction-icon {
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: #f3f4f6;
        }

        .icon-income {
          color: #059669;
        }

        .icon-expense {
          color: #dc2626;
        }

        .transaction-details h4,
        .invoice-details h4 {
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
        }

        .transaction-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .separator {
          color: #d1d5db;
        }

        .transaction-right,
        .invoice-right {
          text-align: right;
        }

        .transaction-amount {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .transaction-amount.income {
          color: #059669;
        }

        .transaction-amount.expense {
          color: #dc2626;
        }

        .invoice-amount {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .transaction-date,
        .invoice-due {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .invoice-number {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 0.875rem;
          color: #6366f1;
          font-weight: 600;
          margin-right: 1rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .financials-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .tabs-nav {
            flex-wrap: wrap;
          }

          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .filters-left {
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .transaction-item,
          .invoice-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .transaction-right,
          .invoice-right {
            text-align: left;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Financial Management</h1>
                    <p className="page-subtitle">Track transactions, manage accounts, and handle invoices</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="tabs-nav">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    Transactions
                </button>
                <button
                    className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
                    onClick={() => setActiveTab('invoices')}
                >
                    Invoices
                </button>
            </nav>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'invoices' && renderInvoices()}
        </div>
    );
};