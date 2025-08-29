import React, { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Send,
    XCircle,
    AlertCircle,
    DollarSign,
    Calendar,
    User,
    Building,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    Target,
    TrendingUp
} from 'lucide-react';
import InvoiceCreationModal from './InvoiceCreationModal';

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    propertyName?: string;
    spaceName?: string;
    totalAmount: number;
    balanceAmount: number;
    paidAmount: number;
    dueDate: string;
    issueDate: string;
    status: 'DRAFT' | 'SENT' | 'PARTIAL_PAYMENT' | 'PAID' | 'OVERDUE' | 'VOID';
    invoiceType: 'RENT' | 'LATE_FEE' | 'UTILITY' | 'MAINTENANCE' | 'OTHER';
}

const InvoiceManagement: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    // Mock data for customers and properties (would come from your API)
    const mockCustomers = [
        { id: '1', name: 'John Smith', email: 'john@email.com', propertyName: 'Sunset Apartments', spaceName: 'Unit 2A' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', propertyName: 'Downtown Plaza', spaceName: 'Office 301' },
        { id: '3', name: 'Mike Wilson', email: 'mike@email.com', propertyName: 'Riverside Condos', spaceName: 'Unit 12B' }
    ];

    const mockProperties = [
        {
            id: '1',
            name: 'Sunset Apartments',
            spaces: [{ id: '1a', name: 'Unit 2A' }, { id: '1b', name: 'Unit 3B' }]
        },
        {
            id: '2',
            name: 'Downtown Plaza',
            spaces: [{ id: '2a', name: 'Office 301' }, { id: '2b', name: 'Office 302' }]
        }
    ];

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = () => {
        // Mock invoice data
        const mockInvoices: Invoice[] = [
            {
                id: '1',
                invoiceNumber: 'INV-2025-000001',
                customerName: 'John Smith',
                customerEmail: 'john@example.com',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 2A',
                totalAmount: 1200,
                balanceAmount: 1200,
                paidAmount: 0,
                dueDate: '2025-02-15',
                issueDate: '2025-01-15',
                status: 'SENT',
                invoiceType: 'RENT'
            },
            {
                id: '2',
                invoiceNumber: 'INV-2025-000002',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah@example.com',
                propertyName: 'Downtown Plaza',
                spaceName: 'Office 301',
                totalAmount: 2500,
                balanceAmount: 1000,
                paidAmount: 1500,
                dueDate: '2025-02-10',
                issueDate: '2025-01-10',
                status: 'PARTIAL_PAYMENT',
                invoiceType: 'RENT'
            },
            {
                id: '3',
                invoiceNumber: 'INV-2025-000003',
                customerName: 'Mike Wilson',
                customerEmail: 'mike@example.com',
                propertyName: 'Riverside Condos',
                spaceName: 'Unit 12B',
                totalAmount: 2500,
                balanceAmount: 2500,
                paidAmount: 0,
                dueDate: '2024-12-28',
                issueDate: '2024-12-01',
                status: 'OVERDUE',
                invoiceType: 'RENT'
            },
            {
                id: '4',
                invoiceNumber: 'INV-2025-000004',
                customerName: 'Alice Brown',
                customerEmail: 'alice@example.com',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 3C',
                totalAmount: 1100,
                balanceAmount: 0,
                paidAmount: 1100,
                dueDate: '2025-01-05',
                issueDate: '2024-12-20',
                status: 'PAID',
                invoiceType: 'RENT'
            },
            {
                id: '5',
                invoiceNumber: 'INV-2025-000005',
                customerName: 'Bob Davis',
                customerEmail: 'bob@example.com',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 4D',
                totalAmount: 75,
                balanceAmount: 75,
                paidAmount: 0,
                dueDate: '2025-01-20',
                issueDate: '2025-01-05',
                status: 'SENT',
                invoiceType: 'LATE_FEE'
            }
        ];

        setTimeout(() => {
            setInvoices(mockInvoices);
            setLoading(false);
        }, 1000);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            DRAFT: { class: 'badge-info', icon: Edit, label: 'Draft' },
            SENT: { class: 'badge-info', icon: Send, label: 'Sent' },
            PARTIAL_PAYMENT: { class: 'badge-warning', icon: Clock, label: 'Partial' },
            PAID: { class: 'badge-success', icon: CheckCircle, label: 'Paid' },
            OVERDUE: { class: 'badge-danger', icon: AlertCircle, label: 'Overdue' },
            VOID: { class: 'badge-info', icon: XCircle, label: 'Void' }
        };

        const config = statusConfig[status] || statusConfig.DRAFT;
        const IconComponent = config.icon;

        return (
            <span className={config.class} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <IconComponent size={12} />
                {config.label}
            </span>
        );
    };

    const handleSaveInvoice = async (invoiceData: any, action: 'save' | 'send') => {
        if (editingInvoice) {
            // Update existing invoice
            setInvoices(prev => prev.map(inv =>
                inv.id === editingInvoice.id
                    ? { ...invoiceData, id: editingInvoice.id }
                    : inv
            ));
        } else {
            // Create new invoice
            const newInvoice = {
                ...invoiceData,
                id: Date.now().toString(),
                balanceAmount: invoiceData.lineItems?.reduce((sum: number, item: any) => sum + item.amount, 0) || invoiceData.totalAmount,
                paidAmount: 0
            };
            setInvoices(prev => [newInvoice, ...prev]);
        }

        setEditingInvoice(null);
        setShowCreateModal(false);
    };

    const handleEditInvoice = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setShowCreateModal(true);
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                    <h1 className="welcome-title">Invoice Management</h1>
                    <p className="welcome-subtitle">Create, manage, and track customer invoices</p>
                    <div className="welcome-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingInvoice(null);
                                setShowCreateModal(true);
                            }}
                        >
                            <Plus size={16} />
                            Create Invoice
                        </button>
                        <button className="btn btn-secondary">
                            <Send size={16} />
                            Bulk Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Summary */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{invoices.length}</div>
                    <div className="stat-label">Total Invoices</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="stat-value">
                        ${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Value</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">
                        ${invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Outstanding</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-red">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {invoices.filter(inv => inv.status === 'OVERDUE').length}
                    </div>
                    <div className="stat-label">Overdue</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="dashboard-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {/* Search */}
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
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Status Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} style={{ color: '#6b7280' }} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ALL">All Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="SENT">Sent</option>
                            <option value="PARTIAL_PAYMENT">Partial Payment</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoice List */}
            <div className="dashboard-card">
                <div className="space-y-4">
                    {filteredInvoices.map(invoice => (
                        <div
                            key={invoice.id}
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
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                            {invoice.invoiceNumber}
                                        </h3>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <User size={12} />
                                            {invoice.customerName}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {getStatusBadge(invoice.status)}
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                                                ${invoice.totalAmount.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                Balance: ${invoice.balanceAmount.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                    {invoice.propertyName && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Building size={12} />
                                            {invoice.propertyName} - {invoice.spaceName}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={12} />
                                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '2rem' }}>
                                <button className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}>
                                    <Eye size={14} />
                                </button>

                                <button
                                    onClick={() => handleEditInvoice(invoice)}
                                    className="btn btn-secondary"
                                    style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                >
                                    <Edit size={14} />
                                </button>

                                {invoice.status === 'DRAFT' && (
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        <Send size={14} />
                                        Send
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredInvoices.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                        <FileText size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>No invoices found</h3>
                        <p style={{ margin: 0 }}>Create your first invoice or adjust your search filters.</p>
                    </div>
                )}
            </div>

            {/* Invoice Creation/Edit Modal */}
            <InvoiceCreationModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingInvoice(null);
                }}
                onSave={handleSaveInvoice}
                invoice={editingInvoice}
                customers={mockCustomers}
                properties={mockProperties}
            />
        </div>
    );
};

export default InvoiceManagement;