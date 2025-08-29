import React, { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    Square,
    RotateCcw,
    Calendar,
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Settings,
    Filter,
    Search,
    Send,
    Download,
    Edit,
    Trash2,
    Plus,
    Target,
    TrendingUp,
    FileText,
    User,
    Building
} from 'lucide-react';

interface RecurringPayment {
    id: string;
    customerName: string;
    customerEmail: string;
    propertyName: string;
    spaceName: string;
    amount: number;
    paymentMethod: 'ACH' | 'CREDIT_CARD' | 'CHECK';
    frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    nextPaymentDate: string;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'FAILED';
    autoRetry: boolean;
    retryCount: number;
    maxRetries: number;
    lastPaymentDate?: string;
    lastPaymentStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
    totalProcessed: number;
    createdDate: string;
}

interface BulkOperation {
    id: string;
    name: string;
    type: 'SEND_INVOICES' | 'PROCESS_PAYMENTS' | 'APPLY_LATE_FEES' | 'SEND_REMINDERS';
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    totalItems: number;
    processedItems: number;
    failedItems: number;
    createdDate: string;
    completedDate?: string;
    scheduleDate?: string;
    recurring: boolean;
    recurringSchedule?: string;
}

interface PaymentProcessingStats {
    totalRecurring: number;
    activeRecurring: number;
    monthlyRevenue: number;
    successRate: number;
    failedPayments: number;
    retryQueue: number;
}

const AutomatedPaymentProcessing: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'recurring' | 'bulk'>('recurring');
    const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
    const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
    const [stats, setStats] = useState<PaymentProcessingStats>({
        totalRecurring: 0,
        activeRecurring: 0,
        monthlyRevenue: 0,
        successRate: 0,
        failedPayments: 0,
        retryQueue: 0
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Mock data for recurring payments
        const mockRecurringPayments: RecurringPayment[] = [
            {
                id: '1',
                customerName: 'John Smith',
                customerEmail: 'john@email.com',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 2A',
                amount: 1200,
                paymentMethod: 'ACH',
                frequency: 'MONTHLY',
                nextPaymentDate: '2025-02-01',
                status: 'ACTIVE',
                autoRetry: true,
                retryCount: 0,
                maxRetries: 3,
                lastPaymentDate: '2025-01-01',
                lastPaymentStatus: 'SUCCESS',
                totalProcessed: 14400,
                createdDate: '2024-02-01'
            },
            {
                id: '2',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah@email.com',
                propertyName: 'Downtown Plaza',
                spaceName: 'Office 301',
                amount: 2500,
                paymentMethod: 'CREDIT_CARD',
                frequency: 'MONTHLY',
                nextPaymentDate: '2025-02-05',
                status: 'FAILED',
                autoRetry: true,
                retryCount: 2,
                maxRetries: 3,
                lastPaymentDate: '2025-01-05',
                lastPaymentStatus: 'FAILED',
                totalProcessed: 27500,
                createdDate: '2024-03-05'
            },
            {
                id: '3',
                customerName: 'Mike Wilson',
                customerEmail: 'mike@email.com',
                propertyName: 'Riverside Condos',
                spaceName: 'Unit 12B',
                amount: 1800,
                paymentMethod: 'ACH',
                frequency: 'MONTHLY',
                nextPaymentDate: '2025-02-10',
                status: 'PAUSED',
                autoRetry: false,
                retryCount: 0,
                maxRetries: 3,
                lastPaymentDate: '2024-12-10',
                lastPaymentStatus: 'SUCCESS',
                totalProcessed: 18000,
                createdDate: '2024-01-10'
            }
        ];

        // Mock data for bulk operations
        const mockBulkOperations: BulkOperation[] = [
            {
                id: '1',
                name: 'Monthly Rent Invoice Batch',
                type: 'SEND_INVOICES',
                status: 'COMPLETED',
                totalItems: 45,
                processedItems: 45,
                failedItems: 0,
                createdDate: '2025-01-28T10:00:00Z',
                completedDate: '2025-01-28T10:15:00Z',
                recurring: true,
                recurringSchedule: 'Monthly on 1st'
            },
            {
                id: '2',
                name: 'Late Fee Application',
                type: 'APPLY_LATE_FEES',
                status: 'RUNNING',
                totalItems: 12,
                processedItems: 8,
                failedItems: 1,
                createdDate: '2025-01-28T14:30:00Z',
                recurring: false
            },
            {
                id: '3',
                name: 'Payment Reminder Campaign',
                type: 'SEND_REMINDERS',
                status: 'PENDING',
                totalItems: 23,
                processedItems: 0,
                failedItems: 0,
                createdDate: '2025-01-28T16:00:00Z',
                scheduleDate: '2025-01-29T09:00:00Z',
                recurring: true,
                recurringSchedule: 'Weekly on Monday'
            }
        ];

        setRecurringPayments(mockRecurringPayments);
        setBulkOperations(mockBulkOperations);

        // Calculate stats
        const activeCount = mockRecurringPayments.filter(p => p.status === 'ACTIVE').length;
        const totalRevenue = mockRecurringPayments
            .filter(p => p.status === 'ACTIVE')
            .reduce((sum, p) => sum + p.amount, 0);
        const failedCount = mockRecurringPayments.filter(p => p.status === 'FAILED').length;
        const retryCount = mockRecurringPayments.filter(p => p.retryCount > 0).length;

        setStats({
            totalRecurring: mockRecurringPayments.length,
            activeRecurring: activeCount,
            monthlyRevenue: totalRevenue,
            successRate: activeCount > 0 ? ((activeCount - failedCount) / activeCount) * 100 : 0,
            failedPayments: failedCount,
            retryQueue: retryCount
        });
    };

    const getStatusBadge = (status: string, type: 'payment' | 'operation' = 'payment') => {
        const configs = {
            payment: {
                ACTIVE: { class: 'badge-success', icon: CheckCircle, label: 'Active' },
                PAUSED: { class: 'badge-warning', icon: Pause, label: 'Paused' },
                CANCELLED: { class: 'badge-info', icon: Square, label: 'Cancelled' },
                FAILED: { class: 'badge-danger', icon: XCircle, label: 'Failed' }
            },
            operation: {
                PENDING: { class: 'badge-info', icon: Clock, label: 'Pending' },
                RUNNING: { class: 'badge-warning', icon: Play, label: 'Running' },
                COMPLETED: { class: 'badge-success', icon: CheckCircle, label: 'Completed' },
                FAILED: { class: 'badge-danger', icon: XCircle, label: 'Failed' },
                CANCELLED: { class: 'badge-info', icon: Square, label: 'Cancelled' }
            }
        };

        const config = configs[type][status] || configs[type].PENDING;
        const IconComponent = config.icon;

        return (
            <span className={config.class} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                <IconComponent size={12} />
                {config.label}
            </span>
        );
    };

    const handleRecurringAction = (id: string, action: 'play' | 'pause' | 'cancel' | 'edit') => {
        setRecurringPayments(prev => prev.map(payment => {
            if (payment.id === id) {
                switch (action) {
                    case 'play':
                        return { ...payment, status: 'ACTIVE' as const };
                    case 'pause':
                        return { ...payment, status: 'PAUSED' as const };
                    case 'cancel':
                        return { ...payment, status: 'CANCELLED' as const };
                    default:
                        return payment;
                }
            }
            return payment;
        }));
    };

    const handleBulkOperationAction = (id: string, action: 'start' | 'pause' | 'cancel') => {
        setBulkOperations(prev => prev.map(operation => {
            if (operation.id === id) {
                switch (action) {
                    case 'start':
                        return { ...operation, status: 'RUNNING' as const };
                    case 'pause':
                        return { ...operation, status: 'PENDING' as const };
                    case 'cancel':
                        return { ...operation, status: 'CANCELLED' as const };
                    default:
                        return operation;
                }
            }
            return operation;
        }));
    };

    const filteredRecurringPayments = recurringPayments.filter(payment => {
        const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Header */}
            {/* <div className="welcome-card">
                <div className="welcome-content">
                    <h1 className="welcome-title">Automated Payment Processing</h1>
                    <p className="welcome-subtitle">Manage recurring payments and bulk operations</p>
                    <div className="welcome-actions">
                        <button className="btn btn-primary">
                            <Plus size={16} />
                            New Recurring Payment
                        </button>
                        <button className="btn btn-secondary">
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>
                </div>
            </div> */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>
                            Automated Payment Processing
                        </h1>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
                            Manage recurring payments and bulk operations
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-primary">
                            <Plus size={16} />
                            New Recurring Payment
                        </button>
                        <button className="btn btn-secondary">
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <RotateCcw size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.totalRecurring}</div>
                    <div className="stat-label">Total Recurring</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.activeRecurring}</div>
                    <div className="stat-label">Active Payments</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="stat-value">${stats.monthlyRevenue.toLocaleString()}</div>
                    <div className="stat-label">Monthly Revenue</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.successRate.toFixed(1)}%</div>
                    <div className="stat-label">Success Rate</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('recurring')}
                    className={`btn ${activeTab === 'recurring' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto' }}
                >
                    <RotateCcw size={16} />
                    Recurring Payments
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`btn ${activeTab === 'bulk' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto' }}
                >
                    <Target size={16} />
                    Bulk Operations
                </button>
            </div>

            {activeTab === 'recurring' && (
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Recurring Payments
                        </h2>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type="text"
                                    placeholder="Search payments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    style={{ paddingLeft: '2.5rem', width: '250px' }}
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="PAUSED">Paused</option>
                                <option value="FAILED">Failed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredRecurringPayments.map(payment => (
                            <div
                                key={payment.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(229, 231, 235, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                                    {/* Customer & Property */}
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                            {payment.customerName}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Building size={12} />
                                            {payment.propertyName} - {payment.spaceName}
                                        </div>
                                    </div>

                                    {/* Amount & Method */}
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#111827', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                                            ${payment.amount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CreditCard size={12} />
                                            {payment.paymentMethod}
                                        </div>
                                    </div>

                                    {/* Frequency & Next Payment */}
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>
                                            {payment.frequency.toLowerCase()}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={12} />
                                            {new Date(payment.nextPaymentDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        {getStatusBadge(payment.status, 'payment')}
                                        {payment.retryCount > 0 && (
                                            <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '0.25rem' }}>
                                                Retry {payment.retryCount}/{payment.maxRetries}
                                            </div>
                                        )}
                                    </div>

                                    {/* Last Payment */}
                                    <div>
                                        {payment.lastPaymentDate && (
                                            <>
                                                <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>
                                                    {new Date(payment.lastPaymentDate).toLocaleDateString()}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: payment.lastPaymentStatus === 'SUCCESS' ? '#059669' : '#dc2626' }}>
                                                    {payment.lastPaymentStatus}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                    {payment.status === 'PAUSED' && (
                                        <button
                                            onClick={() => handleRecurringAction(payment.id, 'play')}
                                            className="btn btn-secondary"
                                            style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                        >
                                            <Play size={14} />
                                        </button>
                                    )}

                                    {payment.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => handleRecurringAction(payment.id, 'pause')}
                                            className="btn btn-secondary"
                                            style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                        >
                                            <Pause size={14} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleRecurringAction(payment.id, 'edit')}
                                        className="btn btn-secondary"
                                        style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                    >
                                        <Edit size={14} />
                                    </button>

                                    {payment.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => handleRecurringAction(payment.id, 'cancel')}
                                            className="btn btn-secondary"
                                            style={{
                                                width: 'auto',
                                                padding: '0.5rem',
                                                fontSize: '0.75rem',
                                                background: '#dc2626',
                                                color: 'white'
                                            }}
                                        >
                                            <Square size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'bulk' && (
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Bulk Operations
                        </h2>

                        <button className="btn btn-primary" style={{ width: 'auto' }}>
                            <Plus size={16} />
                            New Bulk Operation
                        </button>
                    </div>

                    <div className="space-y-4">
                        {bulkOperations.map(operation => (
                            <div
                                key={operation.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(229, 231, 235, 0.5)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FileText size={16} style={{ color: 'white' }} />
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                                {operation.name}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                                                {operation.type.replace('_', ' ').toLowerCase()}
                                                {operation.recurring && ` • ${operation.recurringSchedule}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {getStatusBadge(operation.status, 'operation')}

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {operation.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleBulkOperationAction(operation.id, 'start')}
                                                    className="btn btn-secondary"
                                                    style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                                >
                                                    <Play size={14} />
                                                </button>
                                            )}

                                            {operation.status === 'RUNNING' && (
                                                <button
                                                    onClick={() => handleBulkOperationAction(operation.id, 'pause')}
                                                    className="btn btn-secondary"
                                                    style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                                >
                                                    <Pause size={14} />
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-secondary"
                                                style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                            >
                                                <Settings size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {operation.status === 'RUNNING' && operation.totalItems > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                Progress: {operation.processedItems} / {operation.totalItems}
                                            </span>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {Math.round((operation.processedItems / operation.totalItems) * 100)}%
                                            </span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '0.5rem',
                                            background: '#e5e7eb',
                                            borderRadius: '0.25rem',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${(operation.processedItems / operation.totalItems) * 100}%`,
                                                height: '100%',
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Operation Details */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Total Items:</span>
                                        <span style={{ fontWeight: '500', color: '#111827', marginLeft: '0.5rem' }}>
                                            {operation.totalItems}
                                        </span>
                                    </div>

                                    <div>
                                        <span style={{ color: '#6b7280' }}>Processed:</span>
                                        <span style={{ fontWeight: '500', color: '#059669', marginLeft: '0.5rem' }}>
                                            {operation.processedItems}
                                        </span>
                                    </div>

                                    {operation.failedItems > 0 && (
                                        <div>
                                            <span style={{ color: '#6b7280' }}>Failed:</span>
                                            <span style={{ fontWeight: '500', color: '#dc2626', marginLeft: '0.5rem' }}>
                                                {operation.failedItems}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <span style={{ color: '#6b7280' }}>Created:</span>
                                        <span style={{ fontWeight: '500', color: '#111827', marginLeft: '0.5rem' }}>
                                            {new Date(operation.createdDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {operation.scheduleDate && (
                                        <div>
                                            <span style={{ color: '#6b7280' }}>Scheduled:</span>
                                            <span style={{ fontWeight: '500', color: '#d97706', marginLeft: '0.5rem' }}>
                                                {new Date(operation.scheduleDate).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutomatedPaymentProcessing;