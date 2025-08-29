import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Clock,
    DollarSign,
    Calendar,
    Settings,
    Play,
    Pause,
    CheckCircle,
    XCircle,
    FileText,
    User,
    Building,
    Edit,
    Trash2,
    Plus,
    Filter,
    Search,
    Download,
    Mail,
    Phone,
    Target,
    TrendingUp,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface LateFeeRule {
    id: string;
    name: string;
    propertyType?: string;
    entityId?: string;
    gracePeriodDays: number;
    feeType: 'FIXED' | 'PERCENTAGE';
    feeAmount: number;
    maxFeeAmount?: number;
    recurringType: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    status: 'ACTIVE' | 'INACTIVE';
    autoApply: boolean;
    sendNotification: boolean;
    createdDate: string;
}

interface OverdueInvoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    propertyName: string;
    spaceName: string;
    originalAmount: number;
    balanceAmount: number;
    dueDate: string;
    daysOverdue: number;
    lateFeeApplied: number;
    lastLateFeeDate?: string;
    nextLateFeeDate?: string;
    status: 'OVERDUE' | 'LATE_FEE_PENDING' | 'LATE_FEE_APPLIED' | 'COLLECTION';
    customerContact: {
        phone?: string;
        alternateEmail?: string;
    };
    paymentHistory: Array<{
        date: string;
        amount: number;
        type: 'PAYMENT' | 'LATE_FEE' | 'ADJUSTMENT';
    }>;
}

interface LateFeeStats {
    totalOverdue: number;
    pendingLateFees: number;
    lateFeeRevenue: number;
    averageDaysOverdue: number;
    collectionRate: number;
}

interface LateFeeAction {
    id: string;
    invoiceId: string;
    ruleId: string;
    amount: number;
    scheduledDate: string;
    status: 'PENDING' | 'APPLIED' | 'FAILED' | 'CANCELLED';
    reason?: string;
}

const LateFeeManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'overdue'>('overview');
    const [lateFeeRules, setLateFeeRules] = useState<LateFeeRule[]>([]);
    const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
    const [pendingActions, setPendingActions] = useState<LateFeeAction[]>([]);
    const [stats, setStats] = useState<LateFeeStats>({
        totalOverdue: 0,
        pendingLateFees: 0,
        lateFeeRevenue: 0,
        averageDaysOverdue: 0,
        collectionRate: 0
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Mock late fee rules
        const mockRules: LateFeeRule[] = [
            {
                id: '1',
                name: 'Standard Residential Late Fee',
                propertyType: 'RESIDENTIAL',
                gracePeriodDays: 5,
                feeType: 'FIXED',
                feeAmount: 75,
                recurringType: 'ONCE',
                status: 'ACTIVE',
                autoApply: true,
                sendNotification: true,
                createdDate: '2024-01-15'
            },
            {
                id: '2',
                name: 'Commercial Property Late Fee',
                propertyType: 'COMMERCIAL',
                gracePeriodDays: 10,
                feeType: 'PERCENTAGE',
                feeAmount: 5,
                maxFeeAmount: 500,
                recurringType: 'MONTHLY',
                status: 'ACTIVE',
                autoApply: false,
                sendNotification: true,
                createdDate: '2024-01-15'
            },
            {
                id: '3',
                name: 'Premium Properties Late Fee',
                gracePeriodDays: 3,
                feeType: 'FIXED',
                feeAmount: 150,
                recurringType: 'WEEKLY',
                status: 'ACTIVE',
                autoApply: true,
                sendNotification: true,
                createdDate: '2024-02-01'
            }
        ];

        // Mock overdue invoices
        const mockOverdueInvoices: OverdueInvoice[] = [
            {
                id: '1',
                invoiceNumber: 'INV-2024-001',
                customerName: 'John Smith',
                customerEmail: 'john@email.com',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 2A',
                originalAmount: 1200,
                balanceAmount: 1200,
                dueDate: '2024-12-01',
                daysOverdue: 58,
                lateFeeApplied: 75,
                lastLateFeeDate: '2024-12-06',
                nextLateFeeDate: '2025-02-06',
                status: 'LATE_FEE_APPLIED',
                customerContact: {
                    phone: '+1234567890',
                    alternateEmail: 'john.alt@email.com'
                },
                paymentHistory: [
                    { date: '2024-12-06', amount: 75, type: 'LATE_FEE' }
                ]
            },
            {
                id: '2',
                invoiceNumber: 'INV-2024-002',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah@email.com',
                propertyName: 'Downtown Plaza',
                spaceName: 'Office 301',
                originalAmount: 2500,
                balanceAmount: 2500,
                dueDate: '2025-01-15',
                daysOverdue: 14,
                lateFeeApplied: 0,
                status: 'LATE_FEE_PENDING',
                customerContact: {
                    phone: '+1987654321'
                },
                paymentHistory: []
            },
            {
                id: '3',
                invoiceNumber: 'INV-2024-003',
                customerName: 'Mike Wilson',
                customerEmail: 'mike@email.com',
                propertyName: 'Riverside Condos',
                spaceName: 'Unit 12B',
                originalAmount: 1800,
                balanceAmount: 1950,
                dueDate: '2024-11-15',
                daysOverdue: 75,
                lateFeeApplied: 150,
                lastLateFeeDate: '2024-11-20',
                status: 'COLLECTION',
                customerContact: {
                    phone: '+1555666777',
                    alternateEmail: 'mike.work@email.com'
                },
                paymentHistory: [
                    { date: '2024-11-20', amount: 75, type: 'LATE_FEE' },
                    { date: '2024-11-27', amount: 75, type: 'LATE_FEE' }
                ]
            }
        ];

        // Mock pending actions
        const mockPendingActions: LateFeeAction[] = [
            {
                id: '1',
                invoiceId: '2',
                ruleId: '1',
                amount: 75,
                scheduledDate: '2025-01-30',
                status: 'PENDING'
            }
        ];

        setLateFeeRules(mockRules);
        setOverdueInvoices(mockOverdueInvoices);
        setPendingActions(mockPendingActions);

        // Calculate stats
        const totalOverdue = mockOverdueInvoices.length;
        const pendingLateFees = mockPendingActions.filter(a => a.status === 'PENDING').length;
        const lateFeeRevenue = mockOverdueInvoices.reduce((sum, inv) => sum + inv.lateFeeApplied, 0);
        const avgDaysOverdue = mockOverdueInvoices.reduce((sum, inv) => sum + inv.daysOverdue, 0) / totalOverdue;

        setStats({
            totalOverdue,
            pendingLateFees,
            lateFeeRevenue,
            averageDaysOverdue: Math.round(avgDaysOverdue),
            collectionRate: 78.5
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            OVERDUE: { class: 'badge-danger', icon: AlertTriangle, label: 'Overdue' },
            LATE_FEE_PENDING: { class: 'badge-warning', icon: Clock, label: 'Fee Pending' },
            LATE_FEE_APPLIED: { class: 'badge-info', icon: DollarSign, label: 'Fee Applied' },
            COLLECTION: { class: 'badge-danger', icon: AlertCircle, label: 'Collection' },
            ACTIVE: { class: 'badge-success', icon: CheckCircle, label: 'Active' },
            INACTIVE: { class: 'badge-info', icon: XCircle, label: 'Inactive' }
        };

        const config = statusConfig[status] || statusConfig.OVERDUE;
        const IconComponent = config.icon;

        return (
            <span className={config.class} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                <IconComponent size={12} />
                {config.label}
            </span>
        );
    };

    const handleApplyLateFee = (invoiceId: string) => {
        setOverdueInvoices(prev => prev.map(invoice => {
            if (invoice.id === invoiceId) {
                const lateFeeAmount = 75; // This would be calculated based on rules
                return {
                    ...invoice,
                    lateFeeApplied: invoice.lateFeeApplied + lateFeeAmount,
                    balanceAmount: invoice.balanceAmount + lateFeeAmount,
                    status: 'LATE_FEE_APPLIED' as const,
                    lastLateFeeDate: new Date().toISOString().split('T')[0],
                    paymentHistory: [
                        ...invoice.paymentHistory,
                        { date: new Date().toISOString().split('T')[0], amount: lateFeeAmount, type: 'LATE_FEE' as const }
                    ]
                };
            }
            return invoice;
        }));
    };

    const handleBulkLateFeeApplication = () => {
        selectedInvoices.forEach(invoiceId => {
            handleApplyLateFee(invoiceId);
        });
        setSelectedInvoices([]);
    };

    const handleToggleRule = (ruleId: string) => {
        setLateFeeRules(prev => prev.map(rule =>
            rule.id === ruleId
                ? { ...rule, status: rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
                : rule
        ));
    };

    const filteredOverdueInvoices = overdueInvoices.filter(invoice => {
        const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="welcome-card">
                <div className="welcome-content">
                    <h1 className="welcome-title">Late Fee Management</h1>
                    <p className="welcome-subtitle">Automated late fee application and tracking</p>
                    <div className="welcome-actions">
                        <button className="btn btn-primary">
                            <Plus size={16} />
                            New Late Fee Rule
                        </button>
                        <button className="btn btn-secondary">
                            <Settings size={16} />
                            Configure Automation
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-red">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.totalOverdue}</div>
                    <div className="stat-label">Overdue Invoices</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.pendingLateFees}</div>
                    <div className="stat-label">Pending Late Fees</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="stat-value">${stats.lateFeeRevenue.toLocaleString()}</div>
                    <div className="stat-label">Late Fee Revenue</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.collectionRate}%</div>
                    <div className="stat-label">Collection Rate</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto' }}
                >
                    <Target size={16} />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`btn ${activeTab === 'rules' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto' }}
                >
                    <Settings size={16} />
                    Late Fee Rules
                </button>
                <button
                    onClick={() => setActiveTab('overdue')}
                    className={`btn ${activeTab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto' }}
                >
                    <AlertTriangle size={16} />
                    Overdue Invoices
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Pending Actions */}
                    <div className="dashboard-card">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                            Pending Late Fee Actions
                        </h2>

                        {pendingActions.length > 0 ? (
                            <div className="space-y-3">
                                {pendingActions.map(action => {
                                    const invoice = overdueInvoices.find(inv => inv.id === action.invoiceId);
                                    if (!invoice) return null;

                                    return (
                                        <div
                                            key={action.id}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(245, 158, 11, 0.1)',
                                                borderRadius: '0.75rem',
                                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                                    {invoice.customerName} - {invoice.invoiceNumber}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    Late fee of ${action.amount} scheduled for {new Date(action.scheduledDate).toLocaleDateString()}
                                                    • {invoice.daysOverdue} days overdue
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleApplyLateFee(invoice.id)}
                                                    className="btn btn-primary"
                                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                >
                                                    Apply Now
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ width: 'auto', padding: '0.5rem', fontSize: '0.875rem' }}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                <CheckCircle size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>No Pending Actions</h3>
                                <p style={{ margin: 0 }}>All late fees have been processed or scheduled.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-card">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                            Recent Late Fee Activity
                        </h2>

                        <div className="space-y-3">
                            {overdueInvoices
                                .filter(inv => inv.paymentHistory.length > 0)
                                .slice(0, 5)
                                .map(invoice => (
                                    <div
                                        key={invoice.id}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: '0.75rem',
                                            border: '1px solid rgba(229, 231, 235, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                borderRadius: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <DollarSign size={16} style={{ color: 'white' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#111827' }}>
                                                    ${invoice.lateFeeApplied} late fee applied
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {invoice.customerName} - {invoice.invoiceNumber}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {invoice.lastLateFeeDate && new Date(invoice.lastLateFeeDate).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                                                {invoice.daysOverdue} days overdue
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Late Fee Rules
                        </h2>
                        <button className="btn btn-primary" style={{ width: 'auto' }}>
                            <Plus size={16} />
                            Add New Rule
                        </button>
                    </div>

                    <div className="space-y-4">
                        {lateFeeRules.map(rule => (
                            <div
                                key={rule.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(229, 231, 235, 0.5)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '0.25rem' }}>
                                            {rule.name}
                                        </h3>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {rule.propertyType && `${rule.propertyType} Properties • `}
                                            {rule.gracePeriodDays} days grace period
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {getStatusBadge(rule.status)}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleToggleRule(rule.id)}
                                                className="btn btn-secondary"
                                                style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                            >
                                                {rule.status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                style={{
                                                    width: 'auto',
                                                    padding: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    background: '#dc2626',
                                                    color: 'white'
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Fee Type:</span>
                                        <span style={{ fontWeight: '500', color: '#111827', marginLeft: '0.5rem' }}>
                                            {rule.feeType === 'FIXED' ? `${rule.feeAmount}` : `${rule.feeAmount}%`}
                                            {rule.maxFeeAmount && ` (max ${rule.maxFeeAmount})`}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Frequency:</span>
                                        <span style={{ fontWeight: '500', color: '#111827', marginLeft: '0.5rem' }}>
                                            {rule.recurringType}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Auto Apply:</span>
                                        <span style={{
                                            fontWeight: '500',
                                            color: rule.autoApply ? '#059669' : '#dc2626',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {rule.autoApply ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Notifications:</span>
                                        <span style={{
                                            fontWeight: '500',
                                            color: rule.sendNotification ? '#059669' : '#dc2626',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {rule.sendNotification ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Overdue Tab */}
            {activeTab === 'overdue' && (
                <div className="dashboard-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Overdue Invoices
                        </h2>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {selectedInvoices.length > 0 && (
                                <button
                                    onClick={handleBulkLateFeeApplication}
                                    className="btn btn-primary"
                                    style={{ width: 'auto' }}
                                >
                                    Apply Late Fee ({selectedInvoices.length})
                                </button>
                            )}

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
                                    placeholder="Search invoices..."
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
                                <option value="OVERDUE">Overdue</option>
                                <option value="LATE_FEE_PENDING">Fee Pending</option>
                                <option value="LATE_FEE_APPLIED">Fee Applied</option>
                                <option value="COLLECTION">Collection</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredOverdueInvoices.map(invoice => (
                            <div
                                key={invoice.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(229, 231, 235, 0.5)',
                                    borderLeftColor: invoice.daysOverdue > 30 ? '#dc2626' : '#f59e0b',
                                    borderLeftWidth: '4px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedInvoices.includes(invoice.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedInvoices(prev => [...prev, invoice.id]);
                                                } else {
                                                    setSelectedInvoices(prev => prev.filter(id => id !== invoice.id));
                                                }
                                            }}
                                            style={{ transform: 'scale(1.2)' }}
                                        />

                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '0.25rem' }}>
                                                {invoice.invoiceNumber} - {invoice.customerName}
                                            </h3>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Building size={12} />
                                                    {invoice.propertyName} - {invoice.spaceName}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={12} />
                                                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                                </span>
                                                <span style={{
                                                    color: invoice.daysOverdue > 30 ? '#dc2626' : '#f59e0b',
                                                    fontWeight: '500'
                                                }}>
                                                    {invoice.daysOverdue} days overdue
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {getStatusBadge(invoice.status)}

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {invoice.customerContact.phone && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                                    title="Call customer"
                                                >
                                                    <Phone size={14} />
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-secondary"
                                                style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                                title="Send reminder"
                                            >
                                                <Mail size={14} />
                                            </button>

                                            {invoice.status === 'LATE_FEE_PENDING' && (
                                                <button
                                                    onClick={() => handleApplyLateFee(invoice.id)}
                                                    className="btn btn-primary"
                                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                >
                                                    Apply Late Fee
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem', paddingTop: '1rem', borderTop: '1px solid rgba(229, 231, 235, 0.3)' }}>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Original Amount:</span>
                                        <span style={{ fontWeight: '500', color: '#111827', marginLeft: '0.5rem' }}>
                                            ${invoice.originalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Current Balance:</span>
                                        <span style={{ fontWeight: '500', color: '#dc2626', marginLeft: '0.5rem' }}>
                                            ${invoice.balanceAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Late Fees Applied:</span>
                                        <span style={{ fontWeight: '500', color: '#f59e0b', marginLeft: '0.5rem' }}>
                                            ${invoice.lateFeeApplied}
                                        </span>
                                    </div>
                                    {invoice.nextLateFeeDate && (
                                        <div>
                                            <span style={{ color: '#6b7280' }}>Next Late Fee:</span>
                                            <span style={{ fontWeight: '500', color: '#111827', marginLeft: '0.5rem' }}>
                                                {new Date(invoice.nextLateFeeDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredOverdueInvoices.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <CheckCircle size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>No Overdue Invoices</h3>
                            <p style={{ margin: 0 }}>All invoices are current or have been resolved.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LateFeeManagement;