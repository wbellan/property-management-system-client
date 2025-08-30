import React, { useState, useEffect } from 'react';
import {
    Plus,
    Building2,
    CreditCard,
    Eye,
    Edit,
    Trash2,
    X,
    Save,
    Search,
    Filter,
    DollarSign,
    TrendingUp,
    User,
    Calendar,
    Hash,
    CheckCircle,
    AlertTriangle,
    Clock,
    Receipt,
    Banknote,
    Smartphone,
    FileText,
    ArrowRight,
    Calculator
} from 'lucide-react';

// Types based on your schema
interface Payment {
    id: string;
    entityId: string;
    paymentNumber: string;
    paymentType: 'CASH' | 'CHECK' | 'ACH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MONEY_ORDER' | 'WIRE_TRANSFER';
    paymentMethod: 'ONLINE' | 'MANUAL' | 'AUTO_DEBIT' | 'MAIL' | 'IN_PERSON';
    payerId?: string;
    payerName: string;
    payerEmail?: string;
    amount: number;
    paymentDate: string;
    receivedDate?: string;
    bankLedgerId?: string;
    referenceNumber?: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PROCESSING' | 'CANCELLED';
    processingStatus: 'UNPROCESSED' | 'PROCESSING' | 'CLEARED' | 'BOUNCED' | 'DISPUTED';
    isDeposited: boolean;
    depositDate?: string;
    memo?: string;
    createdAt: string;
    bankLedger?: {
        id: string;
        accountName: string;
        bankName: string;
    };
    paymentApplications: PaymentApplication[];
    appliedAmount: number;
    unappliedAmount: number;
}

interface PaymentApplication {
    id: string;
    paymentId: string;
    invoiceId: string;
    appliedAmount: number;
    appliedDate: string;
    invoice: {
        id: string;
        invoiceNumber: string;
        totalAmount: number;
        balanceAmount: number;
        dueDate: string;
        tenant?: { firstName: string; lastName: string; };
        property?: { name: string; };
        space?: { name: string; };
    };
}

interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
}

interface BankAccount {
    id: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    currentBalance: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    balanceAmount: number;
    dueDate: string;
    tenant?: { firstName: string; lastName: string; };
    property?: { name: string; };
    space?: { name: string; };
    status: string;
}

interface ChartAccount {
    id: string;
    accountCode: string;
    accountName: string;
    accountType: string;
}

const PaymentRecordingInterface: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [chartAccounts, setChartAccounts] = useState<ChartAccount[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED'>('ALL');
    const [filterDeposited, setFilterDeposited] = useState<'ALL' | 'DEPOSITED' | 'UNDEPOSITED'>('ALL');

    // Payment form state
    const [paymentForm, setPaymentForm] = useState({
        payerName: '',
        payerEmail: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        receivedDate: new Date().toISOString().split('T')[0],
        paymentType: 'CHECK' as const,
        paymentMethod: 'MANUAL' as const,
        referenceNumber: '',
        memo: '',
        selectedInvoices: [] as { invoiceId: string; appliedAmount: number }[]
    });

    // Deposit form state
    const [depositForm, setDepositForm] = useState({
        bankAccountId: '',
        depositDate: new Date().toISOString().split('T')[0],
        depositAmount: 0,
        depositSlipNumber: '',
        notes: ''
    });

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            setEntities([
                { id: '1', name: 'Sunset Properties LLC', legalName: 'Sunset Properties LLC', entityType: 'LLC' },
                { id: '2', name: 'Downtown Investments', legalName: 'Downtown Investments Inc.', entityType: 'CORPORATION' }
            ]);
            setSelectedEntity('1');

            setBankAccounts([
                { id: '1', accountName: 'Sunset Operating Account', bankName: 'Chase Bank', accountNumber: '****4567', currentBalance: 125000.50 },
                { id: '2', accountName: 'Sunset Savings Account', bankName: 'Bank of America', accountNumber: '****8901', currentBalance: 50000.00 }
            ]);

            setChartAccounts([
                { id: '1', accountCode: '1001', accountName: 'Cash and Cash Equivalents', accountType: 'ASSET' },
                { id: '4', accountCode: '4100', accountName: 'Rental Income', accountType: 'REVENUE' },
                { id: '5', accountCode: '4200', accountName: 'Late Fees', accountType: 'REVENUE' },
                { id: '6', accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'ASSET' }
            ]);

            setInvoices([
                {
                    id: '1',
                    invoiceNumber: 'INV-2025-001',
                    totalAmount: 2500.00,
                    balanceAmount: 2500.00,
                    dueDate: '2025-02-01',
                    status: 'SENT',
                    tenant: { firstName: 'John', lastName: 'Smith' },
                    property: { name: 'Sunset Apartments' },
                    space: { name: 'Unit 101' }
                },
                {
                    id: '2',
                    invoiceNumber: 'INV-2025-002',
                    totalAmount: 1800.00,
                    balanceAmount: 1800.00,
                    dueDate: '2025-02-01',
                    status: 'SENT',
                    tenant: { firstName: 'Sarah', lastName: 'Johnson' },
                    property: { name: 'Downtown Plaza' },
                    space: { name: 'Suite 205' }
                }
            ]);

            setPayments([
                {
                    id: '1',
                    entityId: '1',
                    paymentNumber: 'PAY-2025-001',
                    paymentType: 'CHECK',
                    paymentMethod: 'MAIL',
                    payerName: 'John Smith',
                    payerEmail: 'john.smith@email.com',
                    amount: 2500.00,
                    paymentDate: '2025-01-15T00:00:00Z',
                    receivedDate: '2025-01-15T00:00:00Z',
                    bankLedgerId: '1',
                    referenceNumber: '1001',
                    status: 'COMPLETED',
                    processingStatus: 'CLEARED',
                    isDeposited: true,
                    depositDate: '2025-01-16T00:00:00Z',
                    memo: 'January rent payment',
                    createdAt: '2025-01-15T10:30:00Z',
                    bankLedger: { id: '1', accountName: 'Sunset Operating Account', bankName: 'Chase Bank' },
                    paymentApplications: [
                        {
                            id: '1',
                            paymentId: '1',
                            invoiceId: '1',
                            appliedAmount: 2500.00,
                            appliedDate: '2025-01-15T00:00:00Z',
                            invoice: {
                                id: '1',
                                invoiceNumber: 'INV-2025-001',
                                totalAmount: 2500.00,
                                balanceAmount: 0,
                                dueDate: '2025-02-01',
                                tenant: { firstName: 'John', lastName: 'Smith' },
                                property: { name: 'Sunset Apartments' },
                                space: { name: 'Unit 101' }
                            }
                        }
                    ],
                    appliedAmount: 2500.00,
                    unappliedAmount: 0
                },
                {
                    id: '2',
                    entityId: '1',
                    paymentNumber: 'PAY-2025-002',
                    paymentType: 'ACH',
                    paymentMethod: 'ONLINE',
                    payerName: 'Sarah Johnson',
                    payerEmail: 'sarah.johnson@email.com',
                    amount: 1850.00,
                    paymentDate: '2025-01-14T00:00:00Z',
                    receivedDate: '2025-01-14T00:00:00Z',
                    status: 'COMPLETED',
                    processingStatus: 'CLEARED',
                    isDeposited: false,
                    memo: 'January rent + late fee',
                    createdAt: '2025-01-14T14:20:00Z',
                    paymentApplications: [
                        {
                            id: '2',
                            paymentId: '2',
                            invoiceId: '2',
                            appliedAmount: 1800.00,
                            appliedDate: '2025-01-14T00:00:00Z',
                            invoice: {
                                id: '2',
                                invoiceNumber: 'INV-2025-002',
                                totalAmount: 1800.00,
                                balanceAmount: 0,
                                dueDate: '2025-02-01',
                                tenant: { firstName: 'Sarah', lastName: 'Johnson' },
                                property: { name: 'Downtown Plaza' },
                                space: { name: 'Suite 205' }
                            }
                        }
                    ],
                    appliedAmount: 1800.00,
                    unappliedAmount: 50.00
                }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPaymentTypeIcon = (type: string) => {
        const icons = {
            'CASH': Banknote,
            'CHECK': Receipt,
            'ACH': Smartphone,
            'CREDIT_CARD': CreditCard,
            'BANK_TRANSFER': ArrowRight,
            'MONEY_ORDER': FileText,
            'WIRE_TRANSFER': ArrowRight
        };
        return icons[type] || Receipt;
    };

    const getPaymentTypeColor = (type: string) => {
        const colors = {
            'CASH': 'stat-icon-green',
            'CHECK': 'stat-icon-blue',
            'ACH': 'stat-icon-purple',
            'CREDIT_CARD': 'stat-icon-orange',
            'BANK_TRANSFER': 'stat-icon-blue',
            'MONEY_ORDER': 'stat-icon-green',
            'WIRE_TRANSFER': 'stat-icon-purple'
        };
        return colors[type] || 'stat-icon-blue';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'COMPLETED': '#059669',
            'PENDING': '#d97706',
            'PROCESSING': '#3b82f6',
            'FAILED': '#dc2626',
            'CANCELLED': '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const handleEntityChange = (entityId: string) => {
        setSelectedEntity(entityId);
        // In real app, fetch data for this entity
    };

    const handleRecordPayment = () => {
        setPaymentForm({
            payerName: '',
            payerEmail: '',
            amount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            receivedDate: new Date().toISOString().split('T')[0],
            paymentType: 'CHECK',
            paymentMethod: 'MANUAL',
            referenceNumber: '',
            memo: '',
            selectedInvoices: []
        });
        setShowPaymentModal(true);
    };

    const handleDepositPayments = () => {
        const undepositedPayments = payments.filter(p => selectedPayments.includes(p.id) && !p.isDeposited);
        const totalAmount = undepositedPayments.reduce((sum, p) => sum + p.amount, 0);

        setDepositForm({
            bankAccountId: '',
            depositDate: new Date().toISOString().split('T')[0],
            depositAmount: totalAmount,
            depositSlipNumber: '',
            notes: `Depositing ${undepositedPayments.length} payments`
        });
        setShowDepositModal(true);
    };

    const handleSavePayment = async () => {
        // In real app, make API call to create payment and auto-generate ledger entries
        console.log('Creating payment:', paymentForm);

        // This would automatically create ledger entries like:
        // DEBIT: Cash Account (or Undeposited Funds) - Payment Amount
        // CREDIT: Accounts Receivable - Applied Amount
        // CREDIT: Unapplied Payments - Unapplied Amount (if any)

        setShowPaymentModal(false);
    };

    const handleSaveDeposit = async () => {
        // In real app, make API call to record deposit and update ledger entries
        console.log('Recording deposit:', depositForm);

        // This would automatically create/update ledger entries like:
        // DEBIT: Bank Account - Deposit Amount
        // CREDIT: Undeposited Funds - Deposit Amount

        // Mark selected payments as deposited
        setPayments(prev => prev.map(p =>
            selectedPayments.includes(p.id) ? { ...p, isDeposited: true, depositDate: depositForm.depositDate } : p
        ));

        setSelectedPayments([]);
        setShowDepositModal(false);
    };

    const handleAddInvoiceToPayment = () => {
        setPaymentForm(prev => ({
            ...prev,
            selectedInvoices: [...prev.selectedInvoices, { invoiceId: '', appliedAmount: 0 }]
        }));
    };

    const handleRemoveInvoiceFromPayment = (index: number) => {
        setPaymentForm(prev => ({
            ...prev,
            selectedInvoices: prev.selectedInvoices.filter((_, i) => i !== index)
        }));
    };

    const handleInvoiceApplicationChange = (index: number, field: string, value: any) => {
        setPaymentForm(prev => ({
            ...prev,
            selectedInvoices: prev.selectedInvoices.map((app, i) =>
                i === index ? { ...app, [field]: value } : app
            )
        }));
    };

    const filteredPayments = payments.filter(payment => {
        // Filter by search term
        if (searchTerm && !payment.payerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(payment.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by status
        if (filterStatus !== 'ALL' && payment.status !== filterStatus) {
            return false;
        }

        // Filter by deposit status
        if (filterDeposited !== 'ALL') {
            if (filterDeposited === 'DEPOSITED' && !payment.isDeposited) return false;
            if (filterDeposited === 'UNDEPOSITED' && payment.isDeposited) return false;
        }

        return true;
    });

    const totalUnappliedAmount = filteredPayments.reduce((sum, p) => sum + p.unappliedAmount, 0);
    const totalUndepositedAmount = filteredPayments.filter(p => !p.isDeposited).reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="properties-loading">
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    Loading Payment Records...
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Fetching payments, invoices, and bank account data
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Header */}
            {/* <div className="properties-header">
                <div>
                    <h1 className="properties-title">Payment Recording</h1>
                    <p className="properties-subtitle">
                        Record payments, manage deposits, and auto-generate journal entries
                    </p>
                </div>
                <div className="properties-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleDepositPayments}
                        disabled={selectedPayments.length === 0}
                        style={{
                            opacity: selectedPayments.length === 0 ? 0.5 : 1
                        }}
                    >
                        <DollarSign style={{ width: '1rem', height: '1rem' }} />
                        Deposit Selected ({selectedPayments.length})
                    </button>
                    <button className="btn btn-primary" onClick={handleRecordPayment}>
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Record Payment
                    </button>
                </div>
            </div> */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>
                            Payment Recording
                        </h1>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
                            Record payments, manage deposits, and auto-generate journal entries
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleDepositPayments}
                            disabled={selectedPayments.length === 0}
                            style={{
                                opacity: selectedPayments.length === 0 ? 0.5 : 1
                            }}
                        >
                            <DollarSign style={{ width: '1rem', height: '1rem' }} />
                            Deposit Selected ({selectedPayments.length})
                        </button>
                        <button className="btn btn-primary" onClick={handleRecordPayment}>
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            Record Payment
                        </button>
                    </div>
                </div>
            </div>

            {/* Entity Selector & Filters */}
            <div className="properties-toolbar">
                <div className="search-container">
                    <Building2 className="search-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
                    <select
                        className="search-input"
                        value={selectedEntity}
                        onChange={(e) => handleEntityChange(e.target.value)}
                        style={{ paddingLeft: '3rem' }}
                    >
                        <option value="">Select Entity</option>
                        {entities.map(entity => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name} ({entity.entityType})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-container">
                        <Search className="search-icon" style={{ width: '1rem', height: '1rem' }} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem', minWidth: '200px' }}
                        />
                    </div>

                    <select
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                    </select>

                    <select
                        className="filter-select"
                        value={filterDeposited}
                        onChange={(e) => setFilterDeposited(e.target.value as any)}
                    >
                        <option value="ALL">All Deposits</option>
                        <option value="DEPOSITED">Deposited</option>
                        <option value="UNDEPOSITED">Undeposited</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
                    </div>
                    <div className="stat-label">Total Payments</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <AlertTriangle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(totalUndepositedAmount)}
                    </div>
                    <div className="stat-label">Undeposited Funds</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <Calculator style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(totalUnappliedAmount)}
                    </div>
                    <div className="stat-label">Unapplied Amount</div>
                </div>
            </div>

            {/* Payment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredPayments.map(payment => {
                    const PaymentIcon = getPaymentTypeIcon(payment.paymentType);

                    return (
                        <div key={payment.id} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem',
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                {/* Left side - Payment info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    flex: '1',
                                    minWidth: '300px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPayments.includes(payment.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedPayments([...selectedPayments, payment.id]);
                                            } else {
                                                setSelectedPayments(selectedPayments.filter(id => id !== payment.id));
                                            }
                                        }}
                                        style={{ marginTop: '0.5rem', flexShrink: 0 }}
                                    />

                                    <div className={`stat-icon ${getPaymentTypeColor(payment.paymentType)}`}
                                        style={{ width: '3rem', height: '3rem', flexShrink: 0 }}>
                                        <PaymentIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '600',
                                                color: 'var(--gray-900)',
                                                margin: 0,
                                                flexShrink: 0
                                            }}>
                                                {payment.paymentNumber}
                                            </h3>
                                            <span style={{
                                                background: getStatusColor(payment.status),
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                textTransform: 'uppercase',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {payment.status}
                                            </span>
                                            {!payment.isDeposited && (
                                                <span style={{
                                                    background: '#d97706',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    flexShrink: 0,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    UNDEPOSITED
                                                </span>
                                            )}
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--gray-500)',
                                            marginBottom: '0.5rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                                <User style={{ width: '1rem', height: '1rem' }} />
                                                <span>{payment.payerName}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                                <Calendar style={{ width: '1rem', height: '1rem' }} />
                                                <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                                            </div>
                                            {payment.referenceNumber && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                                    <Hash style={{ width: '1rem', height: '1rem' }} />
                                                    <span>{payment.referenceNumber}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--gray-600)',
                                            wordBreak: 'break-word'
                                        }}>
                                            {payment.paymentType} • {payment.paymentMethod}
                                            {payment.bankLedger && ` • ${payment.bankLedger.accountName}`}
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Amount and actions */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    flexShrink: 0
                                }}>
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: 'var(--gray-900)',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {formatCurrency(payment.amount)}
                                        </div>
                                        {payment.unappliedAmount > 0 && (
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#d97706',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {formatCurrency(payment.unappliedAmount)} Unapplied
                                            </div>
                                        )}
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--gray-500)',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            Applied: {formatCurrency(payment.appliedAmount)}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <button className="maintenance-action-btn" title="View Payment">
                                            <Eye style={{ width: '1rem', height: '1rem' }} />
                                        </button>
                                        <button className="maintenance-action-btn" title="Edit Payment">
                                            <Edit style={{ width: '1rem', height: '1rem' }} />
                                        </button>
                                        <button
                                            className="maintenance-action-btn"
                                            title="Delete Payment"
                                            style={{ color: '#dc2626' }}
                                        >
                                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Applications */}
                            {payment.paymentApplications.length > 0 && (
                                <div style={{
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--gray-200)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                                        Applied to Invoices:
                                    </div>
                                    {payment.paymentApplications.map(app => (
                                        <div key={app.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.5rem',
                                            backgroundColor: 'var(--gray-50)',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            gap: '1rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <strong>{app.invoice.invoiceNumber}</strong>
                                                {app.invoice.tenant && (
                                                    <span style={{ color: 'var(--gray-500)' }}>
                                                        {' • '}{app.invoice.tenant.firstName} {app.invoice.tenant.lastName}
                                                    </span>
                                                )}
                                                {app.invoice.property && (
                                                    <span style={{ color: 'var(--gray-500)' }}>
                                                        {' • '}{app.invoice.property.name}
                                                    </span>
                                                )}
                                                {app.invoice.space && (
                                                    <span style={{ color: 'var(--gray-500)' }}>
                                                        {' • '}{app.invoice.space.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                fontWeight: '600',
                                                color: 'var(--gray-900)',
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {formatCurrency(app.appliedAmount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredPayments.length === 0 && (
                    <div className="page-placeholder">
                        <Receipt style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Payments Found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Record your first payment to start tracking rent and other collections.</p>
                        <button className="btn btn-primary" onClick={handleRecordPayment}>
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            Record Payment
                        </button>
                    </div>
                )}
            </div>

            {/* Record Payment Modal */}
            {showPaymentModal && (
                <div style={{
                    position: 'fixed',
                    inset: '0',
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '50rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                Record Payment
                            </h2>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--gray-500)'
                                }}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>

                        {/* Payment Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Payer Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={paymentForm.payerName}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, payerName: e.target.value }))}
                                    placeholder="Enter payer name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Payer Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={paymentForm.payerEmail}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, payerEmail: e.target.value }))}
                                    placeholder="payer@email.com"
                                />
                            </div>

                            <div>
                                <label className="form-label">Payment Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Payment Type *</label>
                                <select
                                    className="form-input"
                                    value={paymentForm.paymentType}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentType: e.target.value as any }))}
                                    required
                                >
                                    <option value="CHECK">Check</option>
                                    <option value="CASH">Cash</option>
                                    <option value="ACH">ACH</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="MONEY_ORDER">Money Order</option>
                                    <option value="WIRE_TRANSFER">Wire Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Payment Method *</label>
                                <select
                                    className="form-input"
                                    value={paymentForm.paymentMethod}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                                    required
                                >
                                    <option value="MANUAL">Manual</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="AUTO_DEBIT">Auto Debit</option>
                                    <option value="MAIL">Mail</option>
                                    <option value="IN_PERSON">In Person</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Payment Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={paymentForm.paymentDate}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Received Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={paymentForm.receivedDate}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, receivedDate: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Reference Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={paymentForm.referenceNumber}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, referenceNumber: e.target.value }))}
                                    placeholder="Check #, Transaction ID, etc."
                                />
                            </div>

                            <div>
                                <label className="form-label">Memo</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={paymentForm.memo}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, memo: e.target.value }))}
                                    placeholder="Payment memo"
                                />
                            </div>
                        </div>

                        {/* Invoice Applications */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)', margin: 0 }}>
                                    Apply to Invoices (Optional)
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleAddInvoiceToPayment}
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                                    Add Invoice
                                </button>
                            </div>

                            {paymentForm.selectedInvoices.map((application, index) => (
                                <div key={index} style={{
                                    padding: '1rem',
                                    border: '1px solid var(--gray-200)',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'var(--gray-50)',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'end' }}>
                                        <div>
                                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Invoice</label>
                                            <select
                                                className="form-input"
                                                value={application.invoiceId}
                                                onChange={(e) => handleInvoiceApplicationChange(index, 'invoiceId', e.target.value)}
                                                style={{ fontSize: '0.875rem' }}
                                            >
                                                <option value="">Select Invoice</option>
                                                {invoices.map(invoice => (
                                                    <option key={invoice.id} value={invoice.id}>
                                                        {invoice.invoiceNumber} - {formatCurrency(invoice.balanceAmount)} remaining
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Applied Amount</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-input"
                                                value={application.appliedAmount || ''}
                                                onChange={(e) => handleInvoiceApplicationChange(index, 'appliedAmount', parseFloat(e.target.value) || 0)}
                                                style={{ fontSize: '0.875rem', minWidth: '120px' }}
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInvoiceFromPayment(index)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#dc2626',
                                                    cursor: 'pointer',
                                                    padding: '0.5rem'
                                                }}
                                                title="Remove Invoice"
                                            >
                                                <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowPaymentModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSavePayment}
                                style={{ flex: 1 }}
                            >
                                <Save style={{ width: '1rem', height: '1rem' }} />
                                Record Payment & Generate Journal Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDepositModal && (
                <div style={{
                    position: 'fixed',
                    inset: '0',
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '32rem', margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                Record Bank Deposit
                            </h2>
                            <button
                                onClick={() => setShowDepositModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--gray-500)'
                                }}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Bank Account *</label>
                                <select
                                    className="form-input"
                                    value={depositForm.bankAccountId}
                                    onChange={(e) => setDepositForm(prev => ({ ...prev, bankAccountId: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Bank Account</option>
                                    {bankAccounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.accountName} ({account.bankName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Deposit Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={depositForm.depositDate}
                                    onChange={(e) => setDepositForm(prev => ({ ...prev, depositDate: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Deposit Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={depositForm.depositAmount}
                                    onChange={(e) => setDepositForm(prev => ({ ...prev, depositAmount: parseFloat(e.target.value) || 0 }))}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Deposit Slip Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={depositForm.depositSlipNumber}
                                    onChange={(e) => setDepositForm(prev => ({ ...prev, depositSlipNumber: e.target.value }))}
                                    placeholder="Enter deposit slip number"
                                />
                            </div>

                            <div>
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={depositForm.notes}
                                    onChange={(e) => setDepositForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Deposit notes"
                                />
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.5rem' }}>
                                <strong>This will automatically create the following journal entry:</strong>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', fontFamily: 'monospace' }}>
                                DEBIT: Bank Account - {formatCurrency(depositForm.depositAmount)}<br />
                                CREDIT: Undeposited Funds - {formatCurrency(depositForm.depositAmount)}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDepositModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveDeposit}
                                disabled={!depositForm.bankAccountId}
                                style={{
                                    flex: 1,
                                    opacity: !depositForm.bankAccountId ? 0.5 : 1
                                }}
                            >
                                <Save style={{ width: '1rem', height: '1rem' }} />
                                Record Deposit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentRecordingInterface;