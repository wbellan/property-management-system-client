// src/components/financial/ExpenseManagement.tsx
import React, { useState, useEffect } from 'react';
import {
    Receipt,
    Plus,
    Search,
    Filter,
    Upload,
    Download,
    Building2,
    User,
    Calendar,
    DollarSign,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    Paperclip,
    Tag,
    TrendingUp,
    Target,
    FileText,
    CreditCard
} from 'lucide-react';

interface Expense {
    id: string;
    expenseNumber: string;
    description: string;
    amount: number;
    expenseDate: string;
    category: string;
    vendor?: string;
    propertyName?: string;
    spaceName?: string;
    paymentMethod: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'ACH' | 'WIRE';
    status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
    attachments?: number;
    recurring: boolean;
    recurringSchedule?: string;
    approvedBy?: string;
    paidDate?: string;
}

interface ExpenseCategory {
    id: string;
    name: string;
    color: string;
    count: number;
    totalAmount: number;
}

interface Vendor {
    id: string;
    name: string;
    totalExpenses: number;
    lastActivity: string;
}

const ExpenseManagement: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        // Mock data
        const mockExpenses: Expense[] = [
            {
                id: '1',
                expenseNumber: 'EXP-2025-001',
                description: 'HVAC Maintenance Service',
                amount: 450.00,
                expenseDate: '2025-01-20',
                category: 'MAINTENANCE',
                vendor: 'ABC HVAC Services',
                propertyName: 'Sunset Apartments',
                spaceName: 'Building A',
                paymentMethod: 'CHECK',
                status: 'APPROVED',
                attachments: 2,
                recurring: false,
                approvedBy: 'John Manager'
            },
            {
                id: '2',
                expenseNumber: 'EXP-2025-002',
                description: 'Property Insurance Premium',
                amount: 2850.00,
                expenseDate: '2025-01-15',
                category: 'INSURANCE',
                vendor: 'State Farm Insurance',
                propertyName: 'Downtown Plaza',
                paymentMethod: 'ACH',
                status: 'PAID',
                attachments: 1,
                recurring: true,
                recurringSchedule: 'Monthly',
                approvedBy: 'Sarah Admin',
                paidDate: '2025-01-16'
            },
            {
                id: '3',
                expenseNumber: 'EXP-2025-003',
                description: 'Landscaping Services',
                amount: 680.00,
                expenseDate: '2025-01-18',
                category: 'LANDSCAPING',
                vendor: 'Green Thumb Landscaping',
                propertyName: 'Sunset Apartments',
                paymentMethod: 'CREDIT_CARD',
                status: 'PENDING',
                attachments: 3,
                recurring: false
            },
            {
                id: '4',
                expenseNumber: 'EXP-2025-004',
                description: 'Office Supplies',
                amount: 125.50,
                expenseDate: '2025-01-19',
                category: 'OFFICE',
                vendor: 'Staples',
                paymentMethod: 'CREDIT_CARD',
                status: 'APPROVED',
                attachments: 1,
                recurring: false,
                approvedBy: 'Mike Wilson'
            },
            {
                id: '5',
                expenseNumber: 'EXP-2025-005',
                description: 'Water Utility Bill',
                amount: 340.75,
                expenseDate: '2025-01-17',
                category: 'UTILITIES',
                vendor: 'City Water Department',
                propertyName: 'Downtown Plaza',
                paymentMethod: 'ACH',
                status: 'PAID',
                attachments: 1,
                recurring: true,
                recurringSchedule: 'Monthly',
                paidDate: '2025-01-18'
            }
        ];

        const mockCategories: ExpenseCategory[] = [
            { id: '1', name: 'MAINTENANCE', color: '#ef4444', count: 8, totalAmount: 3450.00 },
            { id: '2', name: 'UTILITIES', color: '#3b82f6', count: 12, totalAmount: 5680.25 },
            { id: '3', name: 'INSURANCE', color: '#8b5cf6', count: 4, totalAmount: 8500.00 },
            { id: '4', name: 'LANDSCAPING', color: '#10b981', count: 6, totalAmount: 2340.50 },
            { id: '5', name: 'OFFICE', color: '#f59e0b', count: 3, totalAmount: 450.75 }
        ];

        const mockVendors: Vendor[] = [
            { id: '1', name: 'ABC HVAC Services', totalExpenses: 3450.00, lastActivity: '2025-01-20' },
            { id: '2', name: 'State Farm Insurance', totalExpenses: 8500.00, lastActivity: '2025-01-15' },
            { id: '3', name: 'Green Thumb Landscaping', totalExpenses: 2340.50, lastActivity: '2025-01-18' },
            { id: '4', name: 'City Water Department', totalExpenses: 5680.25, lastActivity: '2025-01-17' }
        ];

        setTimeout(() => {
            setExpenses(mockExpenses);
            setCategories(mockCategories);
            setVendors(mockVendors);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { class: 'badge-warning', icon: Clock, label: 'Pending' },
            APPROVED: { class: 'badge-info', icon: CheckCircle, label: 'Approved' },
            PAID: { class: 'badge-success', icon: CheckCircle, label: 'Paid' },
            REJECTED: { class: 'badge-danger', icon: AlertCircle, label: 'Rejected' }
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        const IconComponent = config.icon;

        return (
            <span className={config.class} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <IconComponent size={12} />
                {config.label}
            </span>
        );
    };

    const getPaymentMethodColor = (method: string) => {
        const methodColors = {
            CASH: '#10b981',
            CHECK: '#3b82f6',
            CREDIT_CARD: '#8b5cf6',
            ACH: '#f59e0b',
            WIRE: '#ef4444'
        };
        return methodColors[method] || '#6b7280';
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === 'ALL' || expense.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || expense.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="welcome-card">
                <div className="welcome-content">
                    <h1 className="welcome-title">Expense Management</h1>
                    <p className="welcome-subtitle">Track and manage property expenses and vendor payments</p>
                    <div className="welcome-actions">
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={16} />
                            Add Expense
                        </button>
                        <button className="btn btn-secondary">
                            <Upload size={16} />
                            Import
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Summary */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <Receipt size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{expenses.length}</div>
                    <div className="stat-label">Total Expenses</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-red">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="stat-value">
                        ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Amount</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {expenses.filter(exp => exp.status === 'PENDING').length}
                    </div>
                    <div className="stat-label">Pending Approval</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {expenses.filter(exp => exp.status === 'PAID').length}
                    </div>
                    <div className="stat-label">Paid This Month</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="chart-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                        <Search size={16} style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af'
                        }} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                background: 'rgba(249, 250, 251, 0.5)',
                                border: '1px solid rgba(229, 231, 235, 0.5)',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(249, 250, 251, 0.5)',
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(249, 250, 251, 0.5)',
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PAID">Paid</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {filteredExpenses.length} expenses
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Expenses List */}
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Expense List</h2>
                        <p className="card-subtitle">Manage your property expenses</p>
                    </div>
                    <div className="space-y-4">
                        {filteredExpenses.map((expense) => (
                            <div key={expense.id} style={{
                                padding: '1.5rem',
                                border: '1px solid rgba(229, 231, 235, 0.5)',
                                borderRadius: '0.75rem',
                                background: 'rgba(249, 250, 251, 0.5)',
                                transition: 'all 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {/* Expense Icon */}
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        <Receipt size={20} />
                                    </div>

                                    {/* Expense Details */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                                                {expense.expenseNumber}
                                            </h3>
                                            {getStatusBadge(expense.status)}
                                            {expense.recurring && (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    color: '#8b5cf6',
                                                    background: 'rgba(139, 92, 246, 0.1)',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.375rem'
                                                }}>
                                                    Recurring
                                                </span>
                                            )}
                                            {expense.attachments && expense.attachments > 0 && (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    color: '#6b7280'
                                                }}>
                                                    <Paperclip size={12} />
                                                    {expense.attachments}
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                                {expense.description}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                {expense.vendor && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <User size={14} />
                                                        {expense.vendor}
                                                    </div>
                                                )}
                                                {expense.propertyName && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Building2 size={14} />
                                                        {expense.propertyName}
                                                        {expense.spaceName && ` - ${expense.spaceName}`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Amount
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626' }}>
                                                    ${expense.amount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Category
                                                </div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    color: categories.find(c => c.name === expense.category)?.color || '#6b7280'
                                                }}>
                                                    {expense.category}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Date
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                                                    {new Date(expense.expenseDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Payment Method
                                                </div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    color: getPaymentMethodColor(expense.paymentMethod)
                                                }}>
                                                    {expense.paymentMethod.replace('_', ' ')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                            <Eye size={14} />
                                            View
                                        </button>

                                        {expense.status === 'PENDING' && (
                                            <button className="btn btn-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                                <CheckCircle size={14} />
                                                Approve
                                            </button>
                                        )}

                                        {expense.status === 'APPROVED' && (
                                            <button className="btn btn-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                                <DollarSign size={14} />
                                                Pay
                                            </button>
                                        )}

                                        <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredExpenses.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                <Receipt size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                    No expenses found
                                </h3>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Get started by adding your first expense'
                                    }
                                </p>
                                {!searchTerm && categoryFilter === 'ALL' && statusFilter === 'ALL' && (
                                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                                        <Plus size={16} />
                                        Add First Expense
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="sidebar-content">
                    {/* Categories */}
                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Expense Categories</h3>
                        </div>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div key={category.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    background: 'rgba(249, 250, 251, 0.5)',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '1rem',
                                            height: '1rem',
                                            borderRadius: '50%',
                                            background: category.color
                                        }} />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                                {category.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                {category.count} expenses
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                        ${category.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Vendors */}
                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Top Vendors</h3>
                        </div>
                        <div className="space-y-3">
                            {vendors.map((vendor) => (
                                <div key={vendor.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'rgba(249, 250, 251, 0.5)',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '2rem',
                                        height: '2rem',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        borderRadius: '0.375rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <User size={12} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                            {vendor.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            ${vendor.totalExpenses.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Quick Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="btn btn-primary w-full">
                                <Plus size={16} />
                                Add Expense
                            </button>
                            <button className="btn btn-secondary w-full">
                                <Upload size={16} />
                                Bulk Import
                            </button>
                            <button className="btn btn-secondary w-full">
                                <Download size={16} />
                                Export Report
                            </button>
                            <button className="btn btn-secondary w-full">
                                <Target size={16} />
                                Set Budget
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseManagement;