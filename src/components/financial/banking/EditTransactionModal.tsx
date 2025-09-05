import React, { useState, useEffect } from 'react';
import { X, DollarSign, AlertTriangle, FileText, Hash, Save } from 'lucide-react';
import { bankingService } from '../../../services/api/bankingService';

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: RegisterTransaction | null;
    onTransactionUpdated: () => void;
    selectedEntityId: string;
    selectedAccountId: string;
}

interface EditForm {
    payeeOrPayer: string;
    referenceNumber: string;
    memo: string;
}

interface RegisterTransaction {
    id: string;
    date: string;
    referenceNumber: string;
    transactionType: 'PAYMENT' | 'DEPOSIT' | 'CHECK' | 'TRANSFER';
    payeeOrPayer: string;
    chartAccount: {
        id: string;
        accountCode: string;
        accountName: string;
        accountType: string;
    };
    memo: string;
    payment: number;
    deposit: number;
    runningBalance: number;
    balance: number;
    isReconciled: boolean;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
    isOpen,
    onClose,
    transaction,
    onTransactionUpdated,
    selectedEntityId,
    selectedAccountId
}) => {
    const [editForm, setEditForm] = useState<EditForm>({
        payeeOrPayer: '',
        referenceNumber: '',
        memo: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initialize form when transaction changes
    useEffect(() => {
        if (transaction) {
            setEditForm({
                payeeOrPayer: transaction.payeeOrPayer || '',
                referenceNumber: transaction.referenceNumber || '',
                memo: transaction.memo || ''
            });
            setError('');
        }
    }, [transaction]);

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Handle form submission
    const handleUpdateTransaction = async () => {
        if (!transaction) return;

        try {
            setLoading(true);
            setError('');

            // Validate required fields
            if (!editForm.payeeOrPayer.trim()) {
                setError('Description is required');
                return;
            }

            const updateData = {
                description: editForm.payeeOrPayer.trim(),
                referenceNumber: editForm.referenceNumber.trim()
            };

            // Use banking service to update transaction
            await bankingService.updateBankTransaction(
                selectedEntityId,
                selectedAccountId,
                transaction.id,
                updateData
            );

            // Success - close modal and refresh data
            onTransactionUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating transaction:', err);
            setError(err instanceof Error ? err.message : 'Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (field: keyof EditForm, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    // Don't render if not open or no transaction
    if (!isOpen || !transaction) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Edit Transaction</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Transaction Info */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <DollarSign size={16} />
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Transaction Details:</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <div>
                                <strong>Amount:</strong> {transaction.payment > 0
                                    ? `-${formatCurrency(transaction.payment)}`
                                    : `+${formatCurrency(transaction.deposit)}`}
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Type:</strong> {transaction.transactionType}
                            </div>
                            <div>
                                <strong>Balance:</strong> {formatCurrency(transaction.balance)}
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    {/* Warning Message */}
                    <div style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                            <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#92400e' }}>
                                Limited Editing
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#92400e' }}>
                            For audit compliance, you can only edit the description, reference number, and memo.
                            Amount and date changes require deleting and recreating the transaction.
                        </p>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateTransaction(); }}>
                        <div style={{ display: 'grid', gap: '1rem' }}>
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
                                    value={editForm.payeeOrPayer}
                                    onChange={(e) => handleInputChange('payeeOrPayer', e.target.value)}
                                    placeholder="Transaction description"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Reference Number */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                }}>
                                    <Hash size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Reference Number
                                </label>
                                <input
                                    type="text"
                                    value={editForm.referenceNumber}
                                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                                    placeholder="Check #, Invoice #, etc."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                    disabled={loading}
                                />
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
                                    value={editForm.memo}
                                    onChange={(e) => handleInputChange('memo', e.target.value)}
                                    placeholder="Additional notes"
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        resize: 'vertical'
                                    }}
                                    disabled={loading}
                                />
                            </div>

                            {/* Read-only fields for reference */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        color: '#6b7280'
                                    }}>
                                        Date (Read-only)
                                    </label>
                                    <input
                                        type="text"
                                        value={new Date(transaction.date).toLocaleDateString()}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: '#f3f4f6',
                                            color: '#6b7280'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        color: '#6b7280'
                                    }}>
                                        Amount (Read-only)
                                    </label>
                                    <input
                                        type="text"
                                        value={transaction.payment > 0
                                            ? `-${formatCurrency(transaction.payment)}`
                                            : `+${formatCurrency(transaction.deposit)}`}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: '#f3f4f6',
                                            color: '#6b7280'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateTransaction}
                        className="btn btn-primary"
                        disabled={loading || !editForm.payeeOrPayer.trim()}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Save size={16} />
                        <span>{loading ? 'Updating...' : 'Update Transaction'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;