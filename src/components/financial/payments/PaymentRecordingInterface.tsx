// src/components/financial/banking/PaymentRecordingInterface.tsx
import React, { useState, useEffect } from 'react';
import {
    Plus,
    DollarSign,
    Check,
    CreditCard,
    Banknote,
    Receipt,
    Eye,
    X,
    Save,
    AlertTriangle,
    CheckCircle,
    Building2,
    CalendarDays,
    Users,
    FileText,
    Loader2
} from 'lucide-react';
import { bankingService } from '../../../services/api/bankingService';
import { apiService } from '../../../services/api/apiService';

interface Entity {
    id: string;
    name: string;
}

interface BankAccount {
    id: string;
    accountName: string;
    bankName: string;
    currentBalance: number;
}

interface RevenueAccount {
    id: string;
    accountCode: string;
    accountName: string;
}

interface PaymentMethod {
    key: string;
    label: string;
    enabled: boolean;
}

interface SinglePaymentData {
    bankAccountId: string;
    paymentId: string;
    invoiceId: string;
    amount: string;
    paymentMethod: string;
    paymentDate: string;
    payerName: string;
    referenceNumber: string;
    revenueAccountId: string;
    description: string;
    notes: string;
}

interface CheckDepositItem {
    checkNumber: string;
    amount: string;
    payerName: string;
    revenueAccountId: string;
    invoiceId: string;
    description: string;
}

interface CheckDepositData {
    bankAccountId: string;
    depositDate: string;
    depositSlipNumber: string;
    checks: CheckDepositItem[];
    totalAmount: string;
    notes: string;
}

const PaymentRecordingInterface: React.FC = () => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [revenueAccounts, setRevenueAccounts] = useState<RevenueAccount[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const [activeTab, setActiveTab] = useState<'single' | 'check' | 'batch'>('single');
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Single Payment Form Data
    const [singlePayment, setSinglePayment] = useState<SinglePaymentData>({
        bankAccountId: '',
        paymentId: '',
        invoiceId: '',
        amount: '',
        paymentMethod: 'CHECK',
        paymentDate: new Date().toISOString().split('T')[0],
        payerName: '',
        referenceNumber: '',
        revenueAccountId: '',
        description: '',
        notes: ''
    });

    // Check Deposit Form Data
    const [checkDeposit, setCheckDeposit] = useState<CheckDepositData>({
        bankAccountId: '',
        depositDate: new Date().toISOString().split('T')[0],
        depositSlipNumber: '',
        checks: [
            {
                checkNumber: '',
                amount: '',
                payerName: '',
                revenueAccountId: '',
                invoiceId: '',
                description: ''
            }
        ],
        totalAmount: '',
        notes: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedEntity) {
            loadEntityData();
        }
    }, [selectedEntity]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const entitiesResponse = await apiService.getEntities();
            setEntities(entitiesResponse.data || []);
            if (entitiesResponse.data && entitiesResponse.data.length > 0) {
                setSelectedEntity(entitiesResponse.data[0].id);
            }
        } catch (err) {
            setError(`Failed to load entities: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const loadEntityData = async () => {
        if (!selectedEntity) return;

        try {
            const [banksResponse, revenueResponse, methodsResponse] = await Promise.all([
                bankingService.getBankAccounts(selectedEntity),
                bankingService.getRevenueAccounts(selectedEntity),
                bankingService.getPaymentMethods(selectedEntity)
            ]);

            console.log('Bank accounts after refresh:', banksResponse);

            setBankAccounts(banksResponse || []);
            setRevenueAccounts(revenueResponse.accounts || []);
            setPaymentMethods(methodsResponse.methods || []);
        } catch (err) {
            setError(`Failed to load entity data: ${err.message}`);
        }
    };

    const handleRecordSinglePayment = async () => {
        if (!selectedEntity) return;

        try {
            setLoading(true);
            setError(null);

            const response = await bankingService.recordPayment(selectedEntity, singlePayment);

            // Format the bank balance as currency
            const formattedBalance = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(parseFloat(response.bankBalance));

            setSuccess(`Payment recorded successfully! New bank balance: ${formattedBalance}`);

            // Force refresh bank accounts with updated balance
            setTimeout(async () => {
                try {
                    const serviceData = await bankingService.getBankAccounts(selectedEntity);
                    setBankAccounts([...serviceData]);
                } catch (err) {
                    console.error('Failed to refresh balance:', err);
                }
            }, 1000);

            setShowRecordModal(false);
            resetSinglePaymentForm();
        } catch (err) {
            setError(`Failed to record payment: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordCheckDeposit = async () => {
        if (!selectedEntity) return;

        // Calculate and validate total
        const calculatedTotal = checkDeposit.checks.reduce((sum, check) =>
            sum + (parseFloat(check.amount) || 0), 0
        );

        const updatedDeposit = {
            ...checkDeposit,
            totalAmount: calculatedTotal.toFixed(2)
        };

        try {
            setLoading(true);
            setError(null);

            const response = await bankingService.recordCheckDeposit(selectedEntity, updatedDeposit);
            setSuccess(`Check deposit recorded! ${response.depositSummary.totalChecks} checks totaling ${response.depositSummary.totalAmount}`);
            setShowRecordModal(false);
            resetCheckDepositForm();

            // Reload bank accounts to update balance
            loadEntityData();
        } catch (err) {
            setError(`Failed to record check deposit: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addCheckToDeposit = () => {
        setCheckDeposit(prev => ({
            ...prev,
            checks: [...prev.checks, {
                checkNumber: '',
                amount: '',
                payerName: '',
                revenueAccountId: '',
                invoiceId: '',
                description: ''
            }]
        }));
    };

    const removeCheckFromDeposit = (index: number) => {
        if (checkDeposit.checks.length > 1) {
            setCheckDeposit(prev => ({
                ...prev,
                checks: prev.checks.filter((_, i) => i !== index)
            }));
        }
    };

    const updateCheckInDeposit = (index: number, field: string, value: string) => {
        setCheckDeposit(prev => ({
            ...prev,
            checks: prev.checks.map((check, i) =>
                i === index ? { ...check, [field]: value } : check
            )
        }));
    };

    const resetSinglePaymentForm = () => {
        setSinglePayment({
            bankAccountId: '',
            paymentId: '',
            invoiceId: '',
            amount: '',
            paymentMethod: 'CHECK',
            paymentDate: new Date().toISOString().split('T')[0],
            payerName: '',
            referenceNumber: '',
            revenueAccountId: '',
            description: '',
            notes: ''
        });
    };

    const resetCheckDepositForm = () => {
        setCheckDeposit({
            bankAccountId: '',
            depositDate: new Date().toISOString().split('T')[0],
            depositSlipNumber: '',
            checks: [{
                checkNumber: '',
                amount: '',
                payerName: '',
                revenueAccountId: '',
                invoiceId: '',
                description: ''
            }],
            totalAmount: '',
            notes: ''
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'CHECK': return <Check className="w-5 h-5" />;
            case 'CASH': return <Banknote className="w-5 h-5" />;
            case 'CREDIT_CARD': return <CreditCard className="w-5 h-5" />;
            default: return <DollarSign className="w-5 h-5" />;
        }
    };

    if (loading && entities.length === 0) {
        return (
            <div className="properties-loading">
                <Loader2 className="animate-spin" style={{ width: '2rem', height: '2rem', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading Payment Interface...</div>
            </div>
        );
    }

    const totalDepositAmount = checkDeposit.checks.reduce((sum, check) =>
        sum + (parseFloat(check.amount) || 0), 0
    );

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {success && (
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#059669', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                    {success}
                </div>
            )}

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle style={{ width: '1.25rem', height: '1.25rem' }} />
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="properties-header">
                <div>
                    <h1 className="properties-title">Payment Recording</h1>
                    <p className="properties-subtitle">Record payments, deposits, and generate ledger entries automatically</p>
                </div>
                <div className="properties-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowRecordModal(true)}
                        disabled={!selectedEntity || bankAccounts.length === 0}
                    >
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Record Payment
                    </button>
                </div>
            </div>

            {/* Entity Selection */}
            <div className="properties-toolbar">
                <div className="search-container">
                    <Building2 className="search-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
                    <select
                        className="search-input"
                        value={selectedEntity}
                        onChange={(e) => setSelectedEntity(e.target.value)}
                        style={{ paddingLeft: '3rem' }}
                    >
                        <option value="">Select Entity</option>
                        {entities.map(entity => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bank Account Summary */}
            {selectedEntity && bankAccounts.length > 0 && (
                <div className="stats-grid">
                    {bankAccounts.map(account => (
                        <div key={account.id} className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon stat-icon-blue">
                                    <Building2 style={{ width: '1.5rem', height: '1.5rem' }} />
                                </div>
                            </div>
                            <div className="stat-value">{formatCurrency(account.currentBalance)}</div>
                            <div className="stat-label">{account.accountName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                {account.bankName}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Recording Modal */}
            {showRecordModal && (
                <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '60rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-900)' }}>Record Payment</h2>
                            <button
                                onClick={() => setShowRecordModal(false)}
                                style={{ background: 'none', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--gray-500)' }}
                                disabled={loading}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setActiveTab('single')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'single' ? '2px solid var(--blue-500)' : 'none',
                                    color: activeTab === 'single' ? 'var(--blue-600)' : 'var(--gray-600)',
                                    fontWeight: activeTab === 'single' ? '600' : '400'
                                }}
                            >
                                <DollarSign style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                                Single Payment
                            </button>
                            <button
                                onClick={() => setActiveTab('check')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === 'check' ? '2px solid var(--blue-500)' : 'none',
                                    color: activeTab === 'check' ? 'var(--blue-600)' : 'var(--gray-600)',
                                    fontWeight: activeTab === 'check' ? '600' : '400'
                                }}
                            >
                                <Check style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                                Check Deposit
                            </button>
                        </div>

                        {/* Single Payment Tab */}
                        {activeTab === 'single' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label className="form-label">Bank Account *</label>
                                        <select
                                            className="form-input"
                                            value={singlePayment.bankAccountId}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, bankAccountId: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select bank account</option>
                                            {bankAccounts.map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.accountName} - {account.bankName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Payment Method *</label>
                                        <select
                                            className="form-input"
                                            value={singlePayment.paymentMethod}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                            required
                                        >
                                            {paymentMethods.map(method => (
                                                <option key={method.key} value={method.key} disabled={!method.enabled}>
                                                    {method.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Amount *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="form-input"
                                            value={singlePayment.amount}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Payment Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={singlePayment.paymentDate}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, paymentDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label className="form-label">Payer Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={singlePayment.payerName}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, payerName: e.target.value }))}
                                            placeholder="Enter payer name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Reference Number</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={singlePayment.referenceNumber}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, referenceNumber: e.target.value }))}
                                            placeholder="Check #, Transaction ID, etc."
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Revenue Account *</label>
                                        <select
                                            className="form-input"
                                            value={singlePayment.revenueAccountId}
                                            onChange={(e) => setSinglePayment(prev => ({ ...prev, revenueAccountId: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select revenue account</option>
                                            {revenueAccounts.map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.accountCode} - {account.accountName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={singlePayment.description}
                                        onChange={(e) => setSinglePayment(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Payment description"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowRecordModal(false)}
                                        style={{ flex: 1 }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleRecordSinglePayment}
                                        style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                                        disabled={loading || !singlePayment.bankAccountId || !singlePayment.amount || !singlePayment.payerName || !singlePayment.revenueAccountId}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                                                Recording...
                                            </>
                                        ) : (
                                            <>
                                                <Save style={{ width: '1rem', height: '1rem' }} />
                                                Record Payment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Check Deposit Tab */}
                        {activeTab === 'check' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label className="form-label">Bank Account *</label>
                                        <select
                                            className="form-input"
                                            value={checkDeposit.bankAccountId}
                                            onChange={(e) => setCheckDeposit(prev => ({ ...prev, bankAccountId: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select bank account</option>
                                            {bankAccounts.map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.accountName} - {account.bankName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Deposit Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={checkDeposit.depositDate}
                                            onChange={(e) => setCheckDeposit(prev => ({ ...prev, depositDate: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Deposit Slip Number</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={checkDeposit.depositSlipNumber}
                                            onChange={(e) => setCheckDeposit(prev => ({ ...prev, depositSlipNumber: e.target.value }))}
                                            placeholder="Optional deposit slip reference"
                                        />
                                    </div>
                                </div>

                                {/* Deposit Summary */}
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: totalDepositAmount > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                                    border: `1px solid ${totalDepositAmount > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)'}`,
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600' }}>
                                            Deposit Total: {checkDeposit.checks.length} checks
                                        </span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                            {formatCurrency(totalDepositAmount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Individual Checks */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Checks to Deposit</h3>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={addCheckToDeposit}
                                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                        >
                                            <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                                            Add Check
                                        </button>
                                    </div>

                                    {checkDeposit.checks.map((check, index) => (
                                        <div key={index} style={{
                                            border: '1px solid var(--gray-200)',
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                            marginBottom: '1rem',
                                            backgroundColor: 'var(--gray-50)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Check #{index + 1}</h4>
                                                {checkDeposit.checks.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCheckFromDeposit(index)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: '0.25rem',
                                                            color: '#dc2626',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <X style={{ width: '1rem', height: '1rem' }} />
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                <div>
                                                    <label className="form-label">Check Number *</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={check.checkNumber}
                                                        onChange={(e) => updateCheckInDeposit(index, 'checkNumber', e.target.value)}
                                                        placeholder="Check number"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Amount *</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="form-input"
                                                        value={check.amount}
                                                        onChange={(e) => updateCheckInDeposit(index, 'amount', e.target.value)}
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Payer Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={check.payerName}
                                                        onChange={(e) => updateCheckInDeposit(index, 'payerName', e.target.value)}
                                                        placeholder="Name on check"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Revenue Account *</label>
                                                    <select
                                                        className="form-input"
                                                        value={check.revenueAccountId}
                                                        onChange={(e) => updateCheckInDeposit(index, 'revenueAccountId', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select account</option>
                                                        {revenueAccounts.map(account => (
                                                            <option key={account.id} value={account.id}>
                                                                {account.accountCode} - {account.accountName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="form-label">Invoice ID (Optional)</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={check.invoiceId}
                                                        onChange={(e) => updateCheckInDeposit(index, 'invoiceId', e.target.value)}
                                                        placeholder="Related invoice"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Description</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={check.description}
                                                        onChange={(e) => updateCheckInDeposit(index, 'description', e.target.value)}
                                                        placeholder="Check memo or description"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label className="form-label">Deposit Notes</label>
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        value={checkDeposit.notes}
                                        onChange={(e) => setCheckDeposit(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Additional notes about this deposit"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowRecordModal(false)}
                                        style={{ flex: 1 }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleRecordCheckDeposit}
                                        style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                                        disabled={loading || !checkDeposit.bankAccountId || checkDeposit.checks.some(c => !c.checkNumber || !c.amount || !c.payerName || !c.revenueAccountId)}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                                                Recording Deposit...
                                            </>
                                        ) : (
                                            <>
                                                <Save style={{ width: '1rem', height: '1rem' }} />
                                                Record Deposit ({formatCurrency(totalDepositAmount)})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentRecordingInterface;