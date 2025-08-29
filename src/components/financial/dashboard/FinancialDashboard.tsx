import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    FileText,
    CreditCard,
    AlertCircle,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    Filter,
    Download,
    Upload,
    ArrowRight
} from 'lucide-react';

// Interfaces
interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    totalAmount: number;
    balanceAmount: number;
    paidAmount: number;
    dueDate: string;
    status: 'DRAFT' | 'SENT' | 'PARTIAL_PAYMENT' | 'PAID' | 'OVERDUE' | 'VOID';
    issueDate: string;
}

interface Payment {
    id: string;
    paymentNumber: string;
    payerName: string;
    amount: number;
    paymentDate: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    availableAmount?: number;
}

interface FinancialMetrics {
    totalRevenue: number;
    totalOutstanding: number;
    overdue: number;
    unappliedPayments: number;
    invoicesCount: number;
    paymentsCount: number;
}

const FinancialDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<FinancialMetrics>({
        totalRevenue: 0,
        totalOutstanding: 0,
        overdue: 0,
        unappliedPayments: 0,
        invoicesCount: 0,
        paymentsCount: 0
    });

    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
    const [unappliedPayments, setUnappliedPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntityId, setSelectedEntityId] = useState('');

    // Mock data for demonstration
    useEffect(() => {
        const mockData = {
            metrics: {
                totalRevenue: 125000,
                totalOutstanding: 18500,
                overdue: 3200,
                unappliedPayments: 5400,
                invoicesCount: 45,
                paymentsCount: 38
            },
            invoices: [
                {
                    id: '1',
                    invoiceNumber: 'INV-2025-000001',
                    customerName: 'John Smith',
                    totalAmount: 1200,
                    balanceAmount: 1200,
                    paidAmount: 0,
                    dueDate: '2025-01-15',
                    status: 'SENT' as const,
                    issueDate: '2025-01-01'
                },
                {
                    id: '2',
                    invoiceNumber: 'INV-2025-000002',
                    customerName: 'Sarah Johnson',
                    totalAmount: 950,
                    balanceAmount: 450,
                    paidAmount: 500,
                    dueDate: '2025-01-10',
                    status: 'PARTIAL_PAYMENT' as const,
                    issueDate: '2024-12-15'
                },
                {
                    id: '3',
                    invoiceNumber: 'INV-2025-000003',
                    customerName: 'Mike Wilson',
                    totalAmount: 800,
                    balanceAmount: 800,
                    paidAmount: 0,
                    dueDate: '2024-12-28',
                    status: 'OVERDUE' as const,
                    issueDate: '2024-12-01'
                }
            ],
            payments: [
                {
                    id: '1',
                    paymentNumber: 'PAY-2025-000001',
                    payerName: 'Mike Wilson',
                    amount: 800,
                    paymentDate: '2025-01-05',
                    status: 'COMPLETED' as const,
                    availableAmount: 800
                },
                {
                    id: '2',
                    paymentNumber: 'PAY-2025-000002',
                    payerName: 'Alice Brown',
                    amount: 1200,
                    paymentDate: '2025-01-03',
                    status: 'COMPLETED' as const,
                    availableAmount: 1200
                }
            ]
        };

        setTimeout(() => {
            setMetrics(mockData.metrics);
            setRecentInvoices(mockData.invoices);
            setUnappliedPayments(mockData.payments);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            DRAFT: { class: 'badge-info', label: 'Draft' },
            SENT: { class: 'badge-info', label: 'Sent' },
            PARTIAL_PAYMENT: { class: 'badge-warning', label: 'Partial' },
            PAID: { class: 'badge-success', label: 'Paid' },
            OVERDUE: { class: 'badge-danger', label: 'Overdue' },
            VOID: { class: 'badge-info', label: 'Void' },
            PENDING: { class: 'badge-warning', label: 'Pending' },
            COMPLETED: { class: 'badge-success', label: 'Completed' },
            FAILED: { class: 'badge-danger', label: 'Failed' }
        };

        const config = statusConfig[status] || statusConfig.DRAFT;
        return <span className={config.class}>{config.label}</span>;
    };

    const handleCreateInvoice = () => {
        // Navigate to invoice creation
        console.log('Create new invoice');
    };

    const handleApplyPayments = () => {
        // Navigate to payment application interface
        console.log('Open payment application interface');
    };

    const handleProcessWorkflow = () => {
        // Trigger workflow processing
        console.log('Process overdue invoices and workflow');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Header */}
            {/* <div className="welcome-card">
                <div className="welcome-content">
                    <h1 className="welcome-title">Financial Management</h1>
                    <p className="welcome-subtitle">Invoice workflow, payment application, and financial oversight</p>
                    <div className="welcome-actions">
                        <button className="btn btn-secondary">
                            <Upload size={16} />
                            Import Data
                        </button>
                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Export Reports
                        </button>
                    </div>
                </div>
            </div> */}

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>
                            Financial Management
                        </h1>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
                            Invoice workflow, payment application, and financial oversight
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-secondary">
                            <Upload size={16} />
                            Import Data
                        </button>
                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Export Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-trend stat-trend-up">
                            <ArrowRight size={12} />
                            +8.2%
                        </div>
                    </div>
                    <div className="stat-value">${metrics.totalRevenue.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <FileText size={24} />
                        </div>
                        <div className="stat-trend stat-trend-up">
                            {metrics.invoicesCount} invoices
                        </div>
                    </div>
                    <div className="stat-value">${metrics.totalOutstanding.toLocaleString()}</div>
                    <div className="stat-label">Outstanding</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-trend stat-trend-danger">
                            Urgent
                        </div>
                    </div>
                    <div className="stat-value">${metrics.overdue.toLocaleString()}</div>
                    <div className="stat-label">Overdue</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <CreditCard size={24} />
                        </div>
                        <div className="stat-trend stat-trend-warning">
                            {metrics.paymentsCount} payments
                        </div>
                    </div>
                    <div className="stat-value">${metrics.unappliedPayments.toLocaleString()}</div>
                    <div className="stat-label">Unapplied Payments</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="content-grid">
                <div className="chart-card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">Quick Actions</h2>
                            <p className="card-subtitle">Common financial operations</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <button className="quick-action-btn quick-action-primary" onClick={handleCreateInvoice}>
                            <Plus size={20} />
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Create Invoice</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Generate new customer invoices</div>
                            </div>
                        </button>

                        <button className="quick-action-btn quick-action-success" onClick={handleApplyPayments}>
                            <CreditCard size={20} />
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Apply Payments</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Match payments to invoices</div>
                            </div>
                        </button>

                        <button className="quick-action-btn quick-action-warning" onClick={handleProcessWorkflow}>
                            <Clock size={20} />
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Process Workflow</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Handle overdue invoices</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Payment Matching Summary */}
                <div className="sidebar-content">
                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Payment Matching</h3>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#f59e0b' }}>
                                {unappliedPayments.length}
                            </div>
                            <div className="stat-label" style={{ marginBottom: '1rem' }}>Unapplied Payments</div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleApplyPayments}>
                                Match Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="content-grid">
                {/* Recent Invoices */}
                <div className="chart-card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">Recent Invoices</h2>
                            <p className="card-subtitle">Latest invoice activity</p>
                        </div>
                        <button className="view-details-btn">
                            View All
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentInvoices.map((invoice) => (
                            <div key={invoice.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'rgba(249, 250, 251, 0.5)',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(249, 250, 251, 0.8)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)'}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600', color: '#111827' }}>{invoice.invoiceNumber}</span>
                                        {getStatusBadge(invoice.status)}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                        {invoice.customerName}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                        ${invoice.balanceAmount.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        of ${invoice.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Unapplied Payments */}
                <div className="chart-card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">Unapplied Payments</h2>
                            <p className="card-subtitle">Payments ready for application</p>
                        </div>
                        <button className="view-details-btn">
                            View All
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {unappliedPayments.map((payment) => (
                            <div key={payment.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'rgba(16, 185, 129, 0.05)',
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600', color: '#111827' }}>{payment.paymentNumber}</span>
                                        {getStatusBadge(payment.status)}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                        {payment.payerName}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        Received: {new Date(payment.paymentDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                                    <div style={{ fontWeight: '600', color: '#059669', marginBottom: '0.25rem' }}>
                                        ${payment.availableAmount.toLocaleString()}
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Apply payment', payment.id);
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Workflow Status */}
            <div className="chart-card">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">Workflow Status</h2>
                        <p className="card-subtitle">Automated process monitoring</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626', marginBottom: '0.5rem' }}>
                            3
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Overdue Invoices</div>
                        <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                            Process Now
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706', marginBottom: '0.5rem' }}>
                            2
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Late Fees Pending</div>
                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                            Apply Fees
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb', marginBottom: '0.5rem' }}>
                            5
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Recurring Due</div>
                        <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                            Generate
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669', marginBottom: '0.5rem' }}>
                            <CheckCircle size={24} style={{ margin: '0 auto' }} />
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>All Systems Active</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;