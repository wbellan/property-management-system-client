// src/components/financial/BankReconciliation.tsx
import React, { useState, useEffect } from 'react';
import {
    Building2,
    CreditCard,
    Upload,
    Download,
    Search,
    Filter,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Calendar,
    DollarSign,
    ArrowRight,
    ArrowLeft,
    Plus,
    Minus,
    Target,
    TrendingUp,
    Clock,
    FileText
} from 'lucide-react';

interface BankAccount {
    id: string;
    accountName: string;
    accountNumber: string;
    accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'MONEY_MARKET';
    currentBalance: number;
    reconciledBalance: number;
    lastReconciledDate: string;
    status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

interface BankTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE';
    category?: string;
    matched: boolean;
    ledgerEntryId?: string;
    confidence?: number;
}

interface ReconciliationSession {
    id: string;
    bankAccountId: string;
    statementDate: string;
    statementBalance: number;
    startingBalance: number;
    endingBalance: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    matchedCount: number;
    unmatchedCount: number;
    variance: number;
}

const BankReconciliation: React.FC = () => {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
    const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
    const [reconciliationSession, setReconciliationSession] = useState<ReconciliationSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [statementBalance, setStatementBalance] = useState<number>(0);
    const [showMatched, setShowMatched] = useState(false);

    useEffect(() => {
        // Mock data
        const mockAccounts: BankAccount[] = [
            {
                id: 'bank-1',
                accountName: 'Operating Account',
                accountNumber: '****-1234',
                accountType: 'CHECKING',
                currentBalance: 45678.90,
                reconciledBalance: 44832.15,
                lastReconciledDate: '2025-01-15',
                status: 'CONNECTED'
            },
            {
                id: 'bank-2',
                accountName: 'Property Reserve',
                accountNumber: '****-5678',
                accountType: 'SAVINGS',
                currentBalance: 125000.00,
                reconciledBalance: 125000.00,
                lastReconciledDate: '2025-01-10',
                status: 'CONNECTED'
            }
        ];

        const mockTransactions: BankTransaction[] = [
            {
                id: 'tx-1',
                date: '2025-01-20',
                description: 'RENT PAYMENT - JOHN SMITH',
                amount: 1200.00,
                type: 'DEPOSIT',
                category: 'RENT',
                matched: true,
                ledgerEntryId: 'le-001',
                confidence: 95
            },
            {
                id: 'tx-2',
                date: '2025-01-19',
                description: 'MAINTENANCE SUPPLY CO',
                amount: -345.67,
                type: 'WITHDRAWAL',
                category: 'MAINTENANCE',
                matched: false,
                confidence: 85
            },
            {
                id: 'tx-3',
                date: '2025-01-18',
                description: 'PROPERTY INSURANCE',
                amount: -890.00,
                type: 'WITHDRAWAL',
                category: 'INSURANCE',
                matched: false,
                confidence: 92
            },
            {
                id: 'tx-4',
                date: '2025-01-17',
                description: 'ACH TRANSFER IN',
                amount: 2500.00,
                type: 'DEPOSIT',
                category: 'TRANSFER',
                matched: true,
                ledgerEntryId: 'le-002',
                confidence: 100
            }
        ];

        setTimeout(() => {
            setBankAccounts(mockAccounts);
            setBankTransactions(mockTransactions);
            setSelectedAccount(mockAccounts[0]);
            setLoading(false);
        }, 1000);
    }, []);

    const startReconciliation = () => {
        if (!selectedAccount) return;

        const newSession: ReconciliationSession = {
            id: `recon-${Date.now()}`,
            bankAccountId: selectedAccount.id,
            statementDate: new Date().toISOString().split('T')[0],
            statementBalance: statementBalance,
            startingBalance: selectedAccount.reconciledBalance,
            endingBalance: selectedAccount.currentBalance,
            status: 'IN_PROGRESS',
            matchedCount: bankTransactions.filter(tx => tx.matched).length,
            unmatchedCount: bankTransactions.filter(tx => !tx.matched).length,
            variance: selectedAccount.currentBalance - statementBalance
        };

        setReconciliationSession(newSession);
    };

    const toggleTransactionMatch = (transactionId: string) => {
        setBankTransactions(prev =>
            prev.map(tx =>
                tx.id === transactionId
                    ? { ...tx, matched: !tx.matched }
                    : tx
            )
        );

        if (reconciliationSession) {
            const updatedSession = { ...reconciliationSession };
            const transaction = bankTransactions.find(tx => tx.id === transactionId);
            if (transaction) {
                if (transaction.matched) {
                    updatedSession.matchedCount--;
                    updatedSession.unmatchedCount++;
                } else {
                    updatedSession.matchedCount++;
                    updatedSession.unmatchedCount--;
                }
                setReconciliationSession(updatedSession);
            }
        }
    };

    const completeReconciliation = () => {
        if (reconciliationSession) {
            setReconciliationSession({
                ...reconciliationSession,
                status: 'COMPLETED'
            });

            if (selectedAccount) {
                setSelectedAccount({
                    ...selectedAccount,
                    reconciledBalance: selectedAccount.currentBalance,
                    lastReconciledDate: new Date().toISOString().split('T')[0]
                });
            }
        }
    };

    const filteredTransactions = bankTransactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || tx.type === filterType;
        const matchesShow = showMatched ? tx.matched : !tx.matched;
        return matchesSearch && matchesType && matchesShow;
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
                    <h1 className="welcome-title">Bank Reconciliation</h1>
                    <p className="welcome-subtitle">Reconcile bank statements with your accounting records</p>
                    <div className="welcome-actions">
                        <button className="btn btn-primary" onClick={startReconciliation}>
                            <Target size={16} />
                            Start Reconciliation
                        </button>
                        <button className="btn btn-secondary">
                            <Upload size={16} />
                            Import Statement
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Selection */}
            <div className="stats-grid">
                {bankAccounts.map((account) => (
                    <div
                        key={account.id}
                        className={`stat-card cursor-pointer transition-all duration-200 ${selectedAccount?.id === account.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                        onClick={() => setSelectedAccount(account)}
                    >
                        <div className="stat-header">
                            <div className="stat-icon stat-icon-blue">
                                <CreditCard size={24} />
                            </div>
                            <div className={`stat-trend ${account.status === 'CONNECTED' ? 'stat-trend-up' : 'stat-trend-danger'
                                }`}>
                                {account.status === 'CONNECTED' ? 'Connected' : 'Disconnected'}
                            </div>
                        </div>
                        <div className="stat-value">${account.currentBalance.toLocaleString()}</div>
                        <div className="stat-label">{account.accountName} {account.accountNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            Last reconciled: {new Date(account.lastReconciledDate).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Reconciliation Status */}
            {reconciliationSession && (
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Reconciliation Session</h2>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span className={`badge ${reconciliationSession.status === 'COMPLETED' ? 'badge-success' : 'badge-info'
                                }`}>
                                {reconciliationSession.status}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Statement Balance</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                                ${reconciliationSession.statementBalance.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Book Balance</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                                ${reconciliationSession.endingBalance.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Variance</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: reconciliationSession.variance === 0 ? '#059669' : '#dc2626' }}>
                                ${Math.abs(reconciliationSession.variance).toLocaleString()}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Progress</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                                {reconciliationSession.matchedCount}/{reconciliationSession.matchedCount + reconciliationSession.unmatchedCount}
                            </div>
                        </div>
                    </div>

                    {reconciliationSession.variance === 0 && reconciliationSession.unmatchedCount === 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <button className="btn btn-success" onClick={completeReconciliation}>
                                <CheckCircle size={16} />
                                Complete Reconciliation
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Statement Balance Input */}
            {!reconciliationSession && (
                <div className="chart-card">
                    <div className="card-header">
                        <h2 className="card-title">Statement Information</h2>
                    </div>
                    <div style={{ maxWidth: '400px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Statement Ending Balance
                        </label>
                        <div style={{ position: 'relative' }}>
                            <DollarSign size={16} style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280'
                            }} />
                            <input
                                type="number"
                                value={statementBalance}
                                onChange={(e) => setStatementBalance(Number(e.target.value))}
                                step={0.01}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    background: 'rgba(249, 250, 251, 0.5)',
                                    border: '1px solid rgba(229, 231, 235, 0.5)',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter statement balance"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="chart-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
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
                            placeholder="Search transactions..."
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
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(249, 250, 251, 0.5)',
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="ALL">All Types</option>
                        <option value="DEPOSIT">Deposits</option>
                        <option value="WITHDRAWAL">Withdrawals</option>
                        <option value="TRANSFER">Transfers</option>
                        <option value="FEE">Fees</option>
                    </select>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`btn ${showMatched ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => setShowMatched(false)}
                        >
                            Unmatched ({bankTransactions.filter(tx => !tx.matched).length})
                        </button>
                        <button
                            className={`btn ${showMatched ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setShowMatched(true)}
                        >
                            Matched ({bankTransactions.filter(tx => tx.matched).length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="chart-card">
                <div className="card-header">
                    <h2 className="card-title">
                        {showMatched ? 'Matched' : 'Unmatched'} Transactions
                    </h2>
                    <p className="card-subtitle">{filteredTransactions.length} transactions</p>
                </div>

                <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                        <div key={transaction.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem',
                            border: `2px solid ${transaction.matched ? '#10b981' : '#e5e7eb'}`,
                            borderRadius: '0.75rem',
                            background: transaction.matched ? 'rgba(16, 185, 129, 0.05)' : 'rgba(249, 250, 251, 0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                            onClick={() => toggleTransactionMatch(transaction.id)}
                        >
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: transaction.amount > 0
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                marginRight: '1rem'
                            }}>
                                {transaction.amount > 0 ? <Plus size={20} /> : <Minus size={20} />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                                        {transaction.description}
                                    </h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.375rem',
                                        background: '#f3f4f6',
                                        color: '#374151'
                                    }}>
                                        {transaction.type}
                                    </span>
                                    {transaction.confidence && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.375rem',
                                            background: transaction.confidence > 90 ? '#dcfce7' : '#fef3c7',
                                            color: transaction.confidence > 90 ? '#166534' : '#92400e'
                                        }}>
                                            {transaction.confidence}% match
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={14} />
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                    {transaction.category && (
                                        <div>{transaction.category}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: transaction.amount > 0 ? '#059669' : '#dc2626',
                                    marginBottom: '0.25rem'
                                }}>
                                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {transaction.matched ? (
                                        <>
                                            <CheckCircle size={14} style={{ color: '#059669' }} />
                                            <span style={{ fontSize: '0.75rem', color: '#059669' }}>Matched</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={14} style={{ color: '#f59e0b' }} />
                                            <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Click to match</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredTransactions.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <Target size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                No {showMatched ? 'matched' : 'unmatched'} transactions
                            </h3>
                            <p>
                                {showMatched
                                    ? 'All transactions have been successfully matched!'
                                    : 'All transactions are already matched or filtered out.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankReconciliation;