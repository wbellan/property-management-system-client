import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, DollarSign } from 'lucide-react';
import { bankingService } from '../../../services/api/bankingService';

interface DeleteTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: RegisterTransaction | null;
    onTransactionDeleted: () => void;
    selectedEntityId: string;
    selectedAccountId: string;
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

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
    isOpen,
    onClose,
    transaction,
    onTransactionDeleted,
    selectedEntityId,
    selectedAccountId
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationInput, setConfirmationInput] = useState('');

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Handle deletion
    const handleDeleteTransaction = async () => {
        if (!transaction) return;

        // Require user to type "DELETE" for confirmation
        if (confirmationInput.toUpperCase() !== 'DELETE') {
            setError('Please type "DELETE" to confirm');
            return;
        }

        try {
            setLoading(true);
            setError('');

            console.log('Deleting transaction:', {
                transactionId: transaction.id,
                entityId: selectedEntityId,
                accountId: selectedAccountId
            });

            // Call banking service to delete transaction
            await bankingService.deleteBankTransaction(
                selectedEntityId,
                selectedAccountId,
                transaction.id
            );

            // Success - close modal and refresh data
            onTransactionDeleted();
            onClose();
            resetModal();
        } catch (err) {
            console.error('Error deleting transaction:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete transaction');
        } finally {
            setLoading(false);
        }
    };

    // Reset modal state
    const resetModal = () => {
        setConfirmationInput('');
        setError('');
        setLoading(false);
    };

    // Handle modal close
    const handleClose = () => {
        if (!loading) {
            resetModal();
            onClose();
        }
    };

    // Don't render if not open or no transaction
    if (!isOpen || !transaction) return null;

    const amount = transaction.payment > 0
        ? formatCurrency(transaction.payment)
        : formatCurrency(transaction.deposit);

    const transactionType = transaction.payment > 0 ? 'Payment' : 'Deposit';

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title" style={{ color: '#dc2626' }}>
                        <Trash2 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Delete Transaction
                    </h2>
                    <button onClick={handleClose} className="modal-close-btn" disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Warning Alert */}
                    <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#dc2626' }}>
                                Warning: Permanent Deletion
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#7f1d1d' }}>
                            This action cannot be undone. The transaction will be permanently removed from your register,
                            your account balance will be updated, and all subsequent running balances will be recalculated.
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <DollarSign size={16} />
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Transaction to Delete:</span>
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <strong>Type:</strong> {transactionType}
                                </div>
                                <div>
                                    <strong>Amount:</strong> <span style={{ color: transaction.payment > 0 ? '#dc2626' : '#059669' }}>
                                        {transaction.payment > 0 ? '-' : '+'}{amount}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Description:</strong> {transaction.payeeOrPayer}
                            </div>
                            <div>
                                <strong>Reference:</strong> {transaction.referenceNumber || 'None'}
                            </div>
                            <div>
                                <strong>Account:</strong> {transaction.chartAccount.accountCode} - {transaction.chartAccount.accountName}
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    {/* Confirmation Input */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                        }}>
                            Type "DELETE" to confirm deletion:
                        </label>
                        <input
                            type="text"
                            value={confirmationInput}
                            onChange={(e) => {
                                setConfirmationInput(e.target.value);
                                if (error) setError(''); // Clear error when user types
                            }}
                            placeholder="Type DELETE here"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase'
                            }}
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {/* Impact Summary */}
                    <div style={{
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fed7aa',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.8125rem',
                        color: '#92400e'
                    }}>
                        <strong>Impact of deletion:</strong>
                        <ul style={{ margin: '0.25rem 0 0 1rem', paddingLeft: '0.5rem' }}>
                            <li>Account balance will change by {transaction.payment > 0 ? '+' : '-'}{amount}</li>
                            <li>All subsequent transaction running balances will be recalculated</li>
                            <li>Deletion will be logged for audit purposes</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                        onClick={handleClose}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteTransaction}
                        className="btn"
                        disabled={loading || confirmationInput.toUpperCase() !== 'DELETE'}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Trash2 size={16} />
                        <span>{loading ? 'Deleting...' : 'Delete Transaction'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTransactionModal;