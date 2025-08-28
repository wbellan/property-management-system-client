import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    FileText,
    ArrowRight,
    DollarSign,
    User,
    Calendar,
    Building,
    CheckCircle,
    AlertCircle,
    Zap,
    Target,
    Shuffle
} from 'lucide-react';

interface Payment {
    id: string;
    paymentNumber: string;
    payerName: string;
    amount: number;
    availableAmount: number;
    paymentDate: string;
    paymentMethod: string;
    status: 'PENDING' | 'COMPLETED';
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    propertyName?: string;
    spaceName?: string;
    totalAmount: number;
    balanceAmount: number;
    dueDate: string;
    status: string;
    daysPastDue?: number;
}

interface PaymentApplication {
    id: string;
    paymentId: string;
    invoiceId: string;
    appliedAmount: number;
    appliedDate: string;
}

const PaymentApplicationInterface: React.FC = () => {
    const [unappliedPayments, setUnappliedPayments] = useState<Payment[]>([]);
    const [outstandingInvoices, setOutstandingInvoices] = useState<Invoice[]>([]);
    const [applications, setApplications] = useState<PaymentApplication[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [applicationAmount, setApplicationAmount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [autoMatchSuggestions, setAutoMatchSuggestions] = useState<any[]>([]);

    useEffect(() => {
        // Mock data
        const mockPayments: Payment[] = [
            {
                id: '1',
                paymentNumber: 'PAY-2025-000001',
                payerName: 'John Smith',
                amount: 1200,
                availableAmount: 1200,
                paymentDate: '2025-01-05',
                paymentMethod: 'ACH',
                status: 'COMPLETED'
            },
            {
                id: '2',
                paymentNumber: 'PAY-2025-000002',
                payerName: 'Sarah Johnson',
                amount: 500,
                availableAmount: 500,
                paymentDate: '2025-01-04',
                paymentMethod: 'CHECK',
                status: 'COMPLETED'
            },
            {
                id: '3',
                paymentNumber: 'PAY-2025-000003',
                payerName: 'Mike Wilson',
                amount: 2500,
                availableAmount: 2500,
                paymentDate: '2025-01-03',
                paymentMethod: 'BANK_TRANSFER',
                status: 'COMPLETED'
            }
        ];

        const mockInvoices: Invoice[] = [
            {
                id: '1',
                invoiceNumber: 'INV-2025-000001',
                customerName: 'John Smith',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 2A',
                totalAmount: 1200,
                balanceAmount: 1200,
                dueDate: '2025-01-15',
                status: 'SENT'
            },
            {
                id: '2',
                invoiceNumber: 'INV-2025-000002',
                customerName: 'Sarah Johnson',
                propertyName: 'Sunset Apartments',
                spaceName: 'Unit 1B',
                totalAmount: 950,
                balanceAmount: 450,
                dueDate: '2025-01-10',
                status: 'PARTIAL_PAYMENT'
            },
            {
                id: '3',
                invoiceNumber: 'INV-2025-000003',
                customerName: 'Mike Wilson',
                propertyName: 'Downtown Plaza',
                spaceName: 'Office 301',
                totalAmount: 2500,
                balanceAmount: 2500,
                dueDate: '2024-12-28',
                status: 'OVERDUE',
                daysPastDue: 10
            },
            {
                id: '4',
                invoiceNumber: 'INV-2025-000004',
                customerName: 'Alice Brown',
                propertyName: 'Park View',
                spaceName: 'Suite 205',
                totalAmount: 1800,
                balanceAmount: 1800,
                dueDate: '2025-01-08',
                status: 'SENT'
            }
        ];

        // Generate auto-match suggestions
        const suggestions = [];
        mockPayments.forEach(payment => {
            const exactMatch = mockInvoices.find(invoice =>
                invoice.customerName === payment.payerName &&
                invoice.balanceAmount <= payment.availableAmount
            );
            if (exactMatch) {
                suggestions.push({
                    paymentId: payment.id,
                    invoiceId: exactMatch.id,
                    confidence: 'HIGH',
                    reason: 'Exact customer match and sufficient amount'
                });
            }
        });

        setTimeout(() => {
            setUnappliedPayments(mockPayments);
            setOutstandingInvoices(mockInvoices);
            setAutoMatchSuggestions(suggestions);
            setLoading(false);
        }, 1000);
    }, []);

    const handlePaymentSelect = (payment: Payment) => {
        setSelectedPayment(payment);
        setSelectedInvoice(null);
        setApplicationAmount(0);
    };

    const handleInvoiceSelect = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        if (selectedPayment) {
            setApplicationAmount(Math.min(selectedPayment.availableAmount, invoice.balanceAmount));
        }
    };

    const handleApplicationAmountChange = (amount: number) => {
        if (!selectedPayment || !selectedInvoice) return;

        const maxAmount = Math.min(selectedPayment.availableAmount, selectedInvoice.balanceAmount);
        setApplicationAmount(Math.min(Math.max(0, amount), maxAmount));
    };

    const handleApplyPayment = () => {
        if (!selectedPayment || !selectedInvoice || applicationAmount <= 0) return;

        const newApplication: PaymentApplication = {
            id: Date.now().toString(),
            paymentId: selectedPayment.id,
            invoiceId: selectedInvoice.id,
            appliedAmount: applicationAmount,
            appliedDate: new Date().toISOString()
        };

        setApplications(prev => [...prev, newApplication]);

        // Update payment available amount
        setUnappliedPayments(prev => prev.map(payment =>
            payment.id === selectedPayment.id
                ? { ...payment, availableAmount: payment.availableAmount - applicationAmount }
                : payment
        ).filter(payment => payment.availableAmount > 0));

        // Update invoice balance
        setOutstandingInvoices(prev => prev.map(invoice =>
            invoice.id === selectedInvoice.id
                ? { ...invoice, balanceAmount: invoice.balanceAmount - applicationAmount }
                : invoice
        ).filter(invoice => invoice.balanceAmount > 0));

        // Clear selections
        setSelectedPayment(null);
        setSelectedInvoice(null);
        setApplicationAmount(0);
    };

    const handleAutoMatch = () => {
        autoMatchSuggestions.forEach(suggestion => {
            const payment = unappliedPayments.find(p => p.id === suggestion.paymentId);
            const invoice = outstandingInvoices.find(i => i.id === suggestion.invoiceId);

            if (payment && invoice) {
                const amount = Math.min(payment.availableAmount, invoice.balanceAmount);

                const newApplication: PaymentApplication = {
                    id: Date.now().toString() + Math.random(),
                    paymentId: payment.id,
                    invoiceId: invoice.id,
                    appliedAmount: amount,
                    appliedDate: new Date().toISOString()
                };

                setApplications(prev => [...prev, newApplication]);
            }
        });

        // Update data after auto-matching
        setAutoMatchSuggestions([]);
        // In real app, you'd refresh the data from API
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
                    <h1 className="welcome-title">Payment Application</h1>
                    <p className="welcome-subtitle">Match and apply payments to outstanding invoices</p>
                    <div className="welcome-actions">
                        <button className="btn btn-primary" onClick={handleAutoMatch} disabled={autoMatchSuggestions.length === 0}>
                            <Zap size={16} />
                            Auto Match ({autoMatchSuggestions.length})
                        </button>
                        <button className="btn btn-secondary">
                            <Shuffle size={16} />
                            Bulk Apply
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Summary */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{unappliedPayments.length}</div>
                    <div className="stat-label">Unapplied Payments</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{outstandingInvoices.length}</div>
                    <div className="stat-label">Outstanding Invoices</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <Target size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{autoMatchSuggestions.length}</div>
                    <div className="stat-label">Auto Matches</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{applications.length}</div>
                    <div className="stat-label">Applied Today</div>
                </div>
            </div>

            {/* Application Interface */}
            <div className="content-grid">
                {/* Unapplied Payments */}
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Unapplied Payments</h2>
                        <p className="card-subtitle">Select a payment to apply</p>
                    </div>
                    <div className="space-y-4">
                        {unappliedPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className={`payment-card ${selectedPayment?.id === payment.id ? 'selected' : ''}`}
                                style={{
                                    padding: '1rem',
                                    border: selectedPayment?.id === payment.id ? '2px solid #3b82f6' : '1px solid rgba(229, 231, 235, 0.5)',
                                    borderRadius: '0.75rem',
                                    background: selectedPayment?.id === payment.id ? 'rgba(59, 130, 246, 0.05)' : 'rgba(249, 250, 251, 0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => handlePaymentSelect(payment)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <CreditCard size={16} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                            {payment.paymentNumber}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <User size={12} style={{ color: '#6b7280' }} />
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {payment.payerName}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
                                            ${payment.availableAmount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            of ${payment.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px solid rgba(229, 231, 235, 0.5)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={12} />
                                        {new Date(payment.paymentDate).toLocaleDateString()}
                                    </div>
                                    <div>{payment.paymentMethod}</div>
                                    <div className="badge-success">{payment.status}</div>
                                </div>
                            </div>
                        ))}

                        {unappliedPayments.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                <CreditCard size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                                <div>No unapplied payments</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Outstanding Invoices */}
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Outstanding Invoices</h2>
                        <p className="card-subtitle">Select an invoice to apply payment</p>
                    </div>
                    <div className="space-y-4">
                        {outstandingInvoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className={`invoice-card ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
                                style={{
                                    padding: '1rem',
                                    border: selectedInvoice?.id === invoice.id ? '2px solid #3b82f6' : '1px solid rgba(229, 231, 235, 0.5)',
                                    borderRadius: '0.75rem',
                                    background: selectedInvoice?.id === invoice.id ? 'rgba(59, 130, 246, 0.05)' : 'rgba(249, 250, 251, 0.5)',
                                    cursor: selectedPayment ? 'pointer' : 'not-allowed',
                                    opacity: selectedPayment ? 1 : 0.6,
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => selectedPayment && handleInvoiceSelect(invoice)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        background: invoice.status === 'OVERDUE'
                                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <FileText size={16} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                            {invoice.invoiceNumber}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <User size={12} style={{ color: '#6b7280' }} />
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {invoice.customerName}
                                            </span>
                                        </div>
                                        {invoice.propertyName && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Building size={12} style={{ color: '#6b7280' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {invoice.propertyName} - {invoice.spaceName}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#dc2626' }}>
                                            ${invoice.balanceAmount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            due {new Date(invoice.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px solid rgba(229, 231, 235, 0.5)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {invoice.status === 'OVERDUE' && invoice.daysPastDue && (
                                            <span className="badge-danger" style={{ fontSize: '0.75rem' }}>
                                                <AlertCircle size={10} />
                                                {invoice.daysPastDue} days overdue
                                            </span>
                                        )}
                                        {invoice.status === 'PARTIAL_PAYMENT' && (
                                            <span className="badge-warning" style={{ fontSize: '0.75rem' }}>
                                                Partially Paid
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {outstandingInvoices.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                                <div>No outstanding invoices</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Form */}
            {selectedPayment && selectedInvoice && (
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Apply Payment</h2>
                        <p className="card-subtitle">Configure the payment application</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        {/* Selected Payment */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#111827' }}>
                                        {selectedPayment.paymentNumber}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {selectedPayment.payerName}
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
                                Available: ${selectedPayment.availableAmount.toLocaleString()}
                            </div>
                        </div>

                        {/* Arrow */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <ArrowRight size={20} />
                            </div>
                        </div>

                        {/* Selected Invoice */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#111827' }}>
                                        {selectedInvoice.invoiceNumber}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {selectedInvoice.customerName}
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#dc2626' }}>
                                Balance: ${selectedInvoice.balanceAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Application Amount */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        marginBottom: '2rem'
                    }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Application Amount
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <DollarSign size={16} style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#6b7280'
                                }} />
                                <input
                                    type="number"
                                    value={applicationAmount}
                                    onChange={(e) => handleApplicationAmountChange(Number(e.target.value))}
                                    max={Math.min(selectedPayment.availableAmount, selectedInvoice.balanceAmount)}
                                    min={0}
                                    step={0.01}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 3rem',
                                        background: 'white',
                                        border: '1px solid rgba(229, 231, 235, 0.5)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1.125rem',
                                        fontWeight: '600'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                                    onClick={() => handleApplicationAmountChange(selectedInvoice.balanceAmount)}
                                >
                                    Full Balance
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                                    onClick={() => handleApplicationAmountChange(selectedPayment.availableAmount)}
                                >
                                    Full Payment
                                </button>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginTop: '0.5rem'
                        }}>
                            <span>Max: ${Math.min(selectedPayment.availableAmount, selectedInvoice.balanceAmount).toLocaleString()}</span>
                            <span>
                                Remaining after: Payment ${(selectedPayment.availableAmount - applicationAmount).toLocaleString()} |
                                Invoice ${(selectedInvoice.balanceAmount - applicationAmount).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSelectedPayment(null);
                                setSelectedInvoice(null);
                                setApplicationAmount(0);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleApplyPayment}
                            disabled={applicationAmount <= 0}
                        >
                            <CheckCircle size={16} />
                            Apply Payment
                        </button>
                    </div>
                </div>
            )}

            {/* Recent Applications */}
            {applications.length > 0 && (
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Applications</h2>
                        <p className="card-subtitle">Successfully applied payments</p>
                    </div>
                    <div className="space-y-4">
                        {applications.slice(-5).reverse().map((app, index) => {
                            const payment = unappliedPayments.find(p => p.id === app.paymentId) ||
                                { paymentNumber: 'Applied', payerName: 'Unknown' };
                            const invoice = outstandingInvoices.find(i => i.id === app.invoiceId) ||
                                { invoiceNumber: 'Applied', customerName: 'Unknown' };

                            return (
                                <div key={app.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}>
                                    <div style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <CheckCircle size={16} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                            Applied ${app.appliedAmount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {payment.paymentNumber} → {invoice.invoiceNumber}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {new Date(app.appliedDate).toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentApplicationInterface;