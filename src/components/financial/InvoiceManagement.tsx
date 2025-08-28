// import React, { useState, useEffect } from 'react';
// import {
//     FileText,
//     Plus,
//     Search,
//     Filter,
//     MoreHorizontal,
//     Send,
//     XCircle,
//     AlertCircle,
//     DollarSign,
//     Calendar,
//     User,
//     Building,
//     Eye,
//     Edit,
//     Trash2,
//     CheckCircle,
//     Clock
// } from 'lucide-react';

// interface Invoice {
//     id: string;
//     invoiceNumber: string;
//     customerName: string;
//     customerEmail: string;
//     propertyName?: string;
//     spaceName?: string;
//     totalAmount: number;
//     balanceAmount: number;
//     paidAmount: number;
//     dueDate: string;
//     issueDate: string;
//     status: 'DRAFT' | 'SENT' | 'PARTIAL_PAYMENT' | 'PAID' | 'OVERDUE' | 'VOID';
//     invoiceType: string;
// }

// const InvoiceManagement: React.FC = () => {
//     const [invoices, setInvoices] = useState<Invoice[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('ALL');
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

//     // Mock data
//     useEffect(() => {
//         const mockInvoices: Invoice[] = [
//             {
//                 id: '1',
//                 invoiceNumber: 'INV-2025-000001',
//                 customerName: 'John Smith',
//                 customerEmail: 'john@example.com',
//                 propertyName: 'Sunset Apartments',
//                 spaceName: 'Unit 2A',
//                 totalAmount: 1200,
//                 balanceAmount: 1200,
//                 paidAmount: 0,
//                 dueDate: '2025-01-15',
//                 issueDate: '2025-01-01',
//                 status: 'SENT',
//                 invoiceType: 'RENT'
//             },
//             {
//                 id: '2',
//                 invoiceNumber: 'INV-2025-000002',
//                 customerName: 'Sarah Johnson',
//                 customerEmail: 'sarah@example.com',
//                 propertyName: 'Sunset Apartments',
//                 spaceName: 'Unit 1B',
//                 totalAmount: 950,
//                 balanceAmount: 450,
//                 paidAmount: 500,
//                 dueDate: '2025-01-10',
//                 issueDate: '2024-12-15',
//                 status: 'PARTIAL_PAYMENT',
//                 invoiceType: 'RENT'
//             },
//             {
//                 id: '3',
//                 invoiceNumber: 'INV-2025-000003',
//                 customerName: 'Mike Wilson',
//                 customerEmail: 'mike@example.com',
//                 propertyName: 'Downtown Plaza',
//                 spaceName: 'Office 301',
//                 totalAmount: 2500,
//                 balanceAmount: 2500,
//                 paidAmount: 0,
//                 dueDate: '2024-12-28',
//                 issueDate: '2024-12-01',
//                 status: 'OVERDUE',
//                 invoiceType: 'RENT'
//             },
//             {
//                 id: '4',
//                 invoiceNumber: 'INV-2025-000004',
//                 customerName: 'Alice Brown',
//                 customerEmail: 'alice@example.com',
//                 propertyName: 'Sunset Apartments',
//                 spaceName: 'Unit 3C',
//                 totalAmount: 1100,
//                 balanceAmount: 0,
//                 paidAmount: 1100,
//                 dueDate: '2025-01-05',
//                 issueDate: '2024-12-20',
//                 status: 'PAID',
//                 invoiceType: 'RENT'
//             },
//             {
//                 id: '5',
//                 invoiceNumber: 'INV-2025-000005',
//                 customerName: 'Bob Davis',
//                 customerEmail: 'bob@example.com',
//                 propertyName: 'Sunset Apartments',
//                 spaceName: 'Unit 4D',
//                 totalAmount: 75,
//                 balanceAmount: 75,
//                 paidAmount: 0,
//                 dueDate: '2025-01-20',
//                 issueDate: '2025-01-05',
//                 status: 'SENT',
//                 invoiceType: 'LATE_FEE'
//             }
//         ];

//         setTimeout(() => {
//             setInvoices(mockInvoices);
//             setLoading(false);
//         }, 1000);
//     }, []);

//     const getStatusBadge = (status: string) => {
//         const statusConfig = {
//             DRAFT: { class: 'badge-info', icon: Edit, label: 'Draft' },
//             SENT: { class: 'badge-info', icon: Send, label: 'Sent' },
//             PARTIAL_PAYMENT: { class: 'badge-warning', icon: Clock, label: 'Partial' },
//             PAID: { class: 'badge-success', icon: CheckCircle, label: 'Paid' },
//             OVERDUE: { class: 'badge-danger', icon: AlertCircle, label: 'Overdue' },
//             VOID: { class: 'badge-info', icon: XCircle, label: 'Void' }
//         };

//         const config = statusConfig[status] || statusConfig.DRAFT;
//         const IconComponent = config.icon;

//         return (
//             <span className={config.class} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                 <IconComponent size={12} />
//                 {config.label}
//             </span>
//         );
//     };

//     const getInvoiceTypeColor = (type: string) => {
//         const typeColors = {
//             RENT: '#3b82f6',
//             LATE_FEE: '#f59e0b',
//             UTILITY: '#8b5cf6',
//             MAINTENANCE: '#ef4444',
//             OTHER: '#6b7280'
//         };
//         return typeColors[type] || typeColors.OTHER;
//     };

//     const filteredInvoices = invoices.filter(invoice => {
//         const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
//         return matchesSearch && matchesStatus;
//     });

//     const handleStatusChange = (invoice: Invoice, newStatus: string) => {
//         setInvoices(prev => prev.map(inv =>
//             inv.id === invoice.id ? { ...inv, status: newStatus as any } : inv
//         ));
//     };

//     const handleSendInvoice = (invoice: Invoice) => {
//         handleStatusChange(invoice, 'SENT');
//     };

//     const handleVoidInvoice = (invoice: Invoice) => {
//         handleStatusChange(invoice, 'VOID');
//     };

//     const handleApplyLateFee = (invoice: Invoice) => {
//         const lateFeeAmount = 75; // Example late fee
//         setInvoices(prev => prev.map(inv =>
//             inv.id === invoice.id
//                 ? {
//                     ...inv,
//                     totalAmount: inv.totalAmount + lateFeeAmount,
//                     balanceAmount: inv.balanceAmount + lateFeeAmount,
//                     status: 'OVERDUE' as any
//                 }
//                 : inv
//         ));
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="loading-spinner"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="welcome-card">
//                 <div className="welcome-content">
//                     <h1 className="welcome-title">Invoice Management</h1>
//                     <p className="welcome-subtitle">Create, manage, and track customer invoices</p>
//                     <div className="welcome-actions">
//                         <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
//                             <Plus size={16} />
//                             Create Invoice
//                         </button>
//                         <button className="btn btn-secondary">
//                             Import
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Toolbar */}
//             <div className="chart-card">
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
//                     {/* Search */}
//                     <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
//                         <Search size={16} style={{
//                             position: 'absolute',
//                             left: '1rem',
//                             top: '50%',
//                             transform: 'translateY(-50%)',
//                             color: '#9ca3af'
//                         }} />
//                         <input
//                             type="text"
//                             placeholder="Search invoices..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             style={{
//                                 width: '100%',
//                                 padding: '0.75rem 1rem 0.75rem 3rem',
//                                 background: 'rgba(249, 250, 251, 0.5)',
//                                 border: '1px solid rgba(229, 231, 235, 0.5)',
//                                 borderRadius: '0.75rem',
//                                 fontSize: '0.875rem'
//                             }}
//                         />
//                     </div>

//                     {/* Status Filter */}
//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         style={{
//                             padding: '0.75rem 1rem',
//                             background: 'rgba(249, 250, 251, 0.5)',
//                             border: '1px solid rgba(229, 231, 235, 0.5)',
//                             borderRadius: '0.75rem',
//                             fontSize: '0.875rem',
//                             minWidth: '150px'
//                         }}
//                     >
//                         <option value="ALL">All Status</option>
//                         <option value="DRAFT">Draft</option>
//                         <option value="SENT">Sent</option>
//                         <option value="PARTIAL_PAYMENT">Partial Payment</option>
//                         <option value="PAID">Paid</option>
//                         <option value="OVERDUE">Overdue</option>
//                         <option value="VOID">Void</option>
//                     </select>

//                     <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//                         {filteredInvoices.length} invoices
//                     </div>
//                 </div>
//             </div>

//             {/* Invoices List */}
//             <div style={{ display: 'grid', gap: '1rem' }}>
//                 {filteredInvoices.map((invoice) => (
//                     <div key={invoice.id} className="card hover-lift" style={{ padding: '1.5rem' }}>
//                         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
//                             {/* Invoice Icon */}
//                             <div style={{
//                                 width: '3rem',
//                                 height: '3rem',
//                                 background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
//                                 borderRadius: '0.75rem',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 color: 'white',
//                                 flexShrink: 0
//                             }}>
//                                 <FileText size={20} />
//                             </div>

//                             {/* Invoice Details */}
//                             <div style={{ flex: 1, minWidth: 0 }}>
//                                 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
//                                     <div>
//                                         <h3 style={{
//                                             fontSize: '1.125rem',
//                                             fontWeight: '700',
//                                             color: '#111827',
//                                             marginBottom: '0.25rem'
//                                         }}>
//                                             {invoice.invoiceNumber}
//                                         </h3>
//                                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
//                                             <User size={14} style={{ color: '#6b7280' }} />
//                                             <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//                                                 {invoice.customerName}
//                                             </span>
//                                         </div>
//                                         {invoice.propertyName && (
//                                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                                                 <Building size={14} style={{ color: '#6b7280' }} />
//                                                 <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//                                                     {invoice.propertyName} - {invoice.spaceName}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                                         {getStatusBadge(invoice.status)}
//                                         <span style={{
//                                             fontSize: '0.75rem',
//                                             fontWeight: '500',
//                                             color: getInvoiceTypeColor(invoice.invoiceType),
//                                             background: `${getInvoiceTypeColor(invoice.invoiceType)}20`,
//                                             padding: '0.25rem 0.5rem',
//                                             borderRadius: '0.375rem'
//                                         }}>
//                                             {invoice.invoiceType.replace('_', ' ')}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Financial Summary */}
//                                 <div style={{
//                                     display: 'grid',
//                                     gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//                                     gap: '1rem',
//                                     marginBottom: '1rem',
//                                     padding: '1rem',
//                                     background: 'rgba(249, 250, 251, 0.5)',
//                                     borderRadius: '0.75rem'
//                                 }}>
//                                     <div>
//                                         <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
//                                             Total Amount
//                                         </div>
//                                         <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
//                                             ${invoice.totalAmount.toLocaleString()}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
//                                             Paid Amount
//                                         </div>
//                                         <div style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>
//                                             ${invoice.paidAmount.toLocaleString()}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
//                                             Balance
//                                         </div>
//                                         <div style={{
//                                             fontSize: '1rem',
//                                             fontWeight: '600',
//                                             color: invoice.balanceAmount > 0 ? '#dc2626' : '#059669'
//                                         }}>
//                                             ${invoice.balanceAmount.toLocaleString()}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
//                                             Due Date
//                                         </div>
//                                         <div style={{
//                                             fontSize: '1rem',
//                                             fontWeight: '600',
//                                             color: invoice.status === 'OVERDUE' ? '#dc2626' : '#111827',
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: '0.25rem'
//                                         }}>
//                                             <Calendar size={14} />
//                                             {new Date(invoice.dueDate).toLocaleDateString()}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Actions */}
//                                 <div style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '0.75rem',
//                                     paddingTop: '1rem',
//                                     borderTop: '1px solid rgba(229, 231, 235, 0.5)',
//                                     flexWrap: 'wrap'
//                                 }}>
//                                     <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
//                                         <Eye size={14} />
//                                         View
//                                     </button>

//                                     {invoice.status === 'DRAFT' && (
//                                         <button
//                                             className="btn btn-success"
//                                             style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
//                                             onClick={() => handleSendInvoice(invoice)}
//                                         >
//                                             <Send size={14} />
//                                             Send
//                                         </button>
//                                     )}

//                                     {(invoice.status === 'SENT' || invoice.status === 'PARTIAL_PAYMENT') && (
//                                         <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
//                                             <Edit size={14} />
//                                             Edit
//                                         </button>
//                                     )}

//                                     {invoice.status === 'OVERDUE' && (
//                                         <button
//                                             className="btn btn-warning"
//                                             style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
//                                             onClick={() => handleApplyLateFee(invoice)}
//                                         >
//                                             <DollarSign size={14} />
//                                             Apply Late Fee
//                                         </button>
//                                     )}

//                                     {invoice.status !== 'PAID' && invoice.status !== 'VOID' && (
//                                         <button
//                                             className="btn btn-danger"
//                                             style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
//                                             onClick={() => handleVoidInvoice(invoice)}
//                                         >
//                                             <XCircle size={14} />
//                                             Void
//                                         </button>
//                                     )}

//                                     {invoice.balanceAmount > 0 && invoice.status !== 'DRAFT' && (
//                                         <button className="btn btn-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
//                                             <DollarSign size={14} />
//                                             Apply Payment
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Empty State */}
//             {filteredInvoices.length === 0 && (
//                 <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
//                     <FileText size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
//                     <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
//                         No invoices found
//                     </h3>
//                     <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
//                         {searchTerm || statusFilter !== 'ALL'
//                             ? 'Try adjusting your search or filter criteria'
//                             : 'Get started by creating your first invoice'
//                         }
//                     </p>
//                     {!searchTerm && statusFilter === 'ALL' && (
//                         <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
//                             <Plus size={16} />
//                             Create First Invoice
//                         </button>
//                     )}
//                 </div>
//             )}

//             {/* Summary Stats */}
//             <div className="stats-grid">
//                 <div className="stat-card">
//                     <div className="stat-header">
//                         <div className="stat-icon stat-icon-blue">
//                             <FileText size={24} />
//                         </div>
//                     </div>
//                     <div className="stat-value">{invoices.length}</div>
//                     <div className="stat-label">Total Invoices</div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-header">
//                         <div className="stat-icon stat-icon-green">
//                             <DollarSign size={24} />
//                         </div>
//                     </div>
//                     <div className="stat-value">
//                         ${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
//                     </div>
//                     <div className="stat-label">Total Value</div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-header">
//                         <div className="stat-icon stat-icon-orange">
//                             <AlertCircle size={24} />
//                         </div>
//                     </div>
//                     <div className="stat-value">
//                         ${invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0).toLocaleString()}
//                     </div>
//                     <div className="stat-label">Outstanding</div>
//                 </div>

//                 <div className="stat-card">
//                     <div className="stat-header">
//                         <div className="stat-icon stat-icon-purple">
//                             <Clock size={24} />
//                         </div>
//                     </div>
//                     <div className="stat-value">
//                         {invoices.filter(inv => inv.status === 'OVERDUE').length}
//                     </div>
//                     <div className="stat-label">Overdue</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InvoiceManagement;

// src/components/financial/InvoiceManagement.tsx (Redesigned like Payment Page)
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
    invoiceType: string;
}

const InvoiceManagement: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

    useEffect(() => {
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
                dueDate: '2025-01-15',
                issueDate: '2025-01-01',
                status: 'SENT',
                invoiceType: 'RENT'
            },
            {
                id: '2',
                invoiceNumber: 'INV-2025-000002',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah@example.com',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 1B',
                totalAmount: 950,
                balanceAmount: 450,
                paidAmount: 500,
                dueDate: '2025-01-10',
                issueDate: '2024-12-15',
                status: 'PARTIAL_PAYMENT',
                invoiceType: 'RENT'
            },
            {
                id: '3',
                invoiceNumber: 'INV-2025-000003',
                customerName: 'Mike Wilson',
                customerEmail: 'mike@example.com',
                propertyName: 'Downtown Plaza',
                spaceName: 'Office 301',
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
    }, []);

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

    const getInvoiceTypeColor = (type: string) => {
        const typeColors = {
            RENT: '#3b82f6',
            LATE_FEE: '#f59e0b',
            UTILITY: '#8b5cf6',
            MAINTENANCE: '#ef4444',
            OTHER: '#6b7280'
        };
        return typeColors[type] || typeColors.OTHER;
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleBulkSend = () => {
        console.log('Bulk send invoices:', selectedInvoices);
    };

    const handleBulkVoid = () => {
        console.log('Bulk void invoices:', selectedInvoices);
    };

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
                        <button className="btn btn-primary">
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
                            placeholder="Search invoices..."
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
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(249, 250, 251, 0.5)',
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                            minWidth: '150px'
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="PARTIAL_PAYMENT">Partial Payment</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="VOID">Void</option>
                    </select>

                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {filteredInvoices.length} invoices
                    </div>
                </div>
            </div>

            {/* Invoice List */}
            <div className="content-grid">
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Invoice List</h2>
                        <p className="card-subtitle">Manage your customer invoices</p>
                    </div>
                    <div className="space-y-4">
                        {filteredInvoices.map((invoice) => (
                            <div key={invoice.id} style={{
                                padding: '1.5rem',
                                border: '1px solid rgba(229, 231, 235, 0.5)',
                                borderRadius: '0.75rem',
                                background: 'rgba(249, 250, 251, 0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(249, 250, 251, 0.8)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {/* Invoice Icon */}
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: invoice.status === 'OVERDUE'
                                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        <FileText size={20} />
                                    </div>

                                    {/* Invoice Details */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                                                {invoice.invoiceNumber}
                                            </h3>
                                            {getStatusBadge(invoice.status)}
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: getInvoiceTypeColor(invoice.invoiceType),
                                                background: `${getInvoiceTypeColor(invoice.invoiceType)}20`,
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.375rem'
                                            }}>
                                                {invoice.invoiceType.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User size={14} style={{ color: '#6b7280' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {invoice.customerName}
                                                </span>
                                            </div>
                                            {invoice.propertyName && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Building size={14} style={{ color: '#6b7280' }} />
                                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                        {invoice.propertyName} - {invoice.spaceName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Total
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                                                    ${invoice.totalAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Paid
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>
                                                    ${invoice.paidAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Balance
                                                </div>
                                                <div style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    color: invoice.balanceAmount > 0 ? '#dc2626' : '#059669'
                                                }}>
                                                    ${invoice.balanceAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Due Date
                                                </div>
                                                <div style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    color: invoice.status === 'OVERDUE' ? '#dc2626' : '#111827',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <Calendar size={12} />
                                                    {new Date(invoice.dueDate).toLocaleDateString()}
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

                                        {invoice.status === 'DRAFT' && (
                                            <button className="btn btn-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                                <Send size={14} />
                                                Send
                                            </button>
                                        )}

                                        {(invoice.status === 'SENT' || invoice.status === 'PARTIAL_PAYMENT') && (
                                            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                                <Edit size={14} />
                                                Edit
                                            </button>
                                        )}

                                        {invoice.balanceAmount > 0 && invoice.status !== 'DRAFT' && (
                                            <button className="btn btn-success" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                                <DollarSign size={14} />
                                                Apply Payment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {filteredInvoices.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                    No invoices found
                                </h3>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    {searchTerm || statusFilter !== 'ALL'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Get started by creating your first invoice'
                                    }
                                </p>
                                {!searchTerm && statusFilter === 'ALL' && (
                                    <button className="btn btn-primary">
                                        <Plus size={16} />
                                        Create First Invoice
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="sidebar-content">
                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Quick Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="btn btn-primary w-full">
                                <Plus size={16} />
                                Create Invoice
                            </button>
                            <button className="btn btn-secondary w-full">
                                <Send size={16} />
                                Bulk Send
                            </button>
                            <button className="btn btn-secondary w-full">
                                <DollarSign size={16} />
                                Apply Payments
                            </button>
                            <button className="btn btn-warning w-full">
                                <Clock size={16} />
                                Process Overdue
                            </button>
                        </div>
                    </div>

                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Activity</h3>
                        </div>
                        <div className="space-y-3">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                                color: '#6b7280'
                            }}>
                                <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    borderRadius: '0.375rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <CheckCircle size={12} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>INV-001 paid</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>2 hours ago</div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                                color: '#6b7280'
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
                                    <Send size={12} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>INV-005 sent</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>5 hours ago</div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                                color: '#6b7280'
                            }}>
                                <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    borderRadius: '0.375rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <AlertCircle size={12} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>INV-003 overdue</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>1 day ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceManagement;