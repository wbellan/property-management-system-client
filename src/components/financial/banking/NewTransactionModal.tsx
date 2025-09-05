// src/components/financial/banking/NewTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import {
    X,
    DollarSign,
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    FileText,
    Receipt,
    Banknote,
    Building,
    Calendar,
    User,
    Hash
} from 'lucide-react';
import { bankingService, type BankAccount, type ChartAccount } from '../../../services/api/bankingService';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEntityId: string;
    selectedAccountId: string;
    bankAccounts: BankAccount[];
    chartAccounts: ChartAccount[];
    onTransactionCreated: () => void;
}

interface TransactionWorkflow {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

interface ManualTransactionForm {
    transactionType: 'DEPOSIT' | 'PAYMENT' | 'TRANSFER';
    amount: string;
    description: string;
    payeeOrPayer: string;
    chartAccountId: string;
    referenceNumber: string;
    transactionDate: string;
    memo: string;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
    isOpen,
    onClose,
    selectedEntityId,
    selectedAccountId,
    bankAccounts,
    chartAccounts,
    onTransactionCreated
}) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Manual transaction form
    const [manualForm, setManualForm] = useState<ManualTransactionForm>({
        transactionType: 'DEPOSIT',
        amount: '',
        description: '',
        payeeOrPayer: '',
        chartAccountId: '',
        referenceNumber: '',
        transactionDate: new Date().toISOString().split('T')[0],
        memo: ''
    });

    const workflows: TransactionWorkflow[] = [
        {
            id: 'manual',
            title: 'Manual Entry',
            description: 'Create a single transaction entry',
            icon: <FileText size={24} />,
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
            id: 'deposit',
            title: 'Deposit Funds',
            description: 'Record money coming into the account',
            icon: <ArrowUpCircle size={24} />,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
            id: 'payment',
            title: 'Record Payment',
            description: 'Record money going out of the account',
            icon: <ArrowDownCircle size={24} />,
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)'
        },
        {
            id: 'transfer',
            title: 'Transfer Funds',
            description: 'Move money between bank accounts',
            icon: <RefreshCw size={24} />,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)'
        }
    ];

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedWorkflow(null);
            setError(null);
            setManualForm({
                transactionType: 'DEPOSIT',
                amount: '',
                description: '',
                payeeOrPayer: '',
                chartAccountId: '',
                referenceNumber: '',
                transactionDate: new Date().toISOString().split('T')[0],
                memo: ''
            });
        }
    }, [isOpen]);

    const handleWorkflowSelect = (workflowId: string) => {
        setSelectedWorkflow(workflowId);

        // Pre-configure form based on workflow
        if (workflowId === 'deposit') {
            setManualForm(prev => ({ ...prev, transactionType: 'DEPOSIT' }));
        } else if (workflowId === 'payment') {
            setManualForm(prev => ({ ...prev, transactionType: 'PAYMENT' }));
        } else if (workflowId === 'transfer') {
            setManualForm(prev => ({ ...prev, transactionType: 'TRANSFER' }));
        }
    };

    const handleManualTransaction = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate form
            if (!manualForm.amount || !manualForm.description || !manualForm.payeeOrPayer) {
                throw new Error('Please fill in all required fields');
            }

            if (!manualForm.chartAccountId) {
                throw new Error('Please select a chart account');
            }

            const amount = parseFloat(manualForm.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }

            // Prepare transaction data
            const transactionData = {
                amount: amount,
                description: manualForm.description,
                transactionDate: manualForm.transactionDate,
                transactionType: manualForm.transactionType,
                referenceNumber: manualForm.referenceNumber || undefined
            };

            // Call the banking service to create the transaction
            await bankingService.createBankTransaction(
                selectedEntityId,
                selectedAccountId,
                transactionData
            );

            // Success - close modal and refresh data
            onTransactionCreated();
            onClose();

        } catch (error) {
            console.error('Error creating transaction:', error);
            setError(error instanceof Error ? error.message : 'Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToWorkflows = () => {
        setSelectedWorkflow(null);
        setError(null);
    };

    if (!isOpen) return null;

    const selectedAccount = bankAccounts.find(a => a.id === selectedAccountId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        {selectedWorkflow ? workflows.find(w => w.id === selectedWorkflow)?.title : 'New Transaction'}
                    </h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Account Info */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Building size={16} />
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Account:</span>
                        </div>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                            {selectedAccount?.accountName} - {selectedAccount?.bankName}
                        </p>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    {!selectedWorkflow ? (
                        // Workflow Selection
                        <div>
                            <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                                Choose the type of transaction you want to create:
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1rem'
                            }}>
                                {workflows.map(workflow => (
                                    <div
                                        key={workflow.id}
                                        onClick={() => handleWorkflowSelect(workflow.id)}
                                        style={{
                                            padding: '1.5rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: 'white'
                                        }}
                                        className="workflow-card"
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <div style={{
                                                padding: '0.75rem',
                                                backgroundColor: workflow.bgColor,
                                                borderRadius: '0.5rem',
                                                color: workflow.color
                                            }}>
                                                {workflow.icon}
                                            </div>
                                            <div>
                                                <h3 style={{
                                                    margin: 0,
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    color: '#1f2937'
                                                }}>
                                                    {workflow.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            color: '#6b7280',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.5
                                        }}>
                                            {workflow.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Transaction Form
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid #e2e8f0'
                            }}>
                                <button
                                    onClick={handleBackToWorkflows}
                                    style={{
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.25rem',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ← Back
                                </button>
                                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    Fill in the transaction details below
                                </span>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleManualTransaction(); }}>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {/* Transaction Type */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                            Transaction Type *
                                        </label>
                                        <select
                                            value={manualForm.transactionType}
                                            onChange={(e) => setManualForm(prev => ({
                                                ...prev,
                                                transactionType: e.target.value as 'DEPOSIT' | 'PAYMENT' | 'TRANSFER'
                                            }))}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="DEPOSIT">Deposit (Money In)</option>
                                            <option value="PAYMENT">Payment (Money Out)</option>
                                            <option value="TRANSFER">Transfer</option>
                                        </select>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                            <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={manualForm.amount}
                                            onChange={(e) => setManualForm(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="0.00"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                            <FileText size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                            Description *
                                        </label>
                                        <input
                                            type="text"
                                            value={manualForm.description}
                                            onChange={(e) => setManualForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Transaction description"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                            required
                                        />
                                    </div>

                                    {/* Payee/Payer */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                            <User size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                            {manualForm.transactionType === 'DEPOSIT' ? 'From (Payer)' : 'To (Payee)'} *
                                        </label>
                                        <input
                                            type="text"
                                            value={manualForm.payeeOrPayer}
                                            onChange={(e) => setManualForm(prev => ({ ...prev, payeeOrPayer: e.target.value }))}
                                            placeholder={manualForm.transactionType === 'DEPOSIT' ? 'Who paid this?' : 'Who received this payment?'}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                            required
                                        />
                                    </div>

                                    {/* Chart Account */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                            Chart Account *
                                        </label>
                                        <select
                                            value={manualForm.chartAccountId}
                                            onChange={(e) => setManualForm(prev => ({ ...prev, chartAccountId: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                            required
                                        >
                                            <option value="">Select account...</option>
                                            {chartAccounts.map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.accountCode} - {account.accountName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date and Reference */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '0.5rem',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>
                                                <Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                                Date *
                                            </label>
                                            <input
                                                type="date"
                                                value={manualForm.transactionDate}
                                                onChange={(e) => setManualForm(prev => ({ ...prev, transactionDate: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '0.5rem',
                                                fontWeight: 500,
                                                fontSize: '0.875rem'
                                            }}>
                                                <Hash size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                                Reference #
                                            </label>
                                            <input
                                                type="text"
                                                value={manualForm.referenceNumber}
                                                onChange={(e) => setManualForm(prev => ({ ...prev, referenceNumber: e.target.value }))}
                                                placeholder="Check #, Invoice #, etc."
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Memo */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                            Memo
                                        </label>
                                        <textarea
                                            value={manualForm.memo}
                                            onChange={(e) => setManualForm(prev => ({ ...prev, memo: e.target.value }))}
                                            placeholder="Additional notes..."
                                            rows={2}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {selectedWorkflow && (
                    <div className="modal-footer">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleManualTransaction}
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Transaction'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewTransactionModal;