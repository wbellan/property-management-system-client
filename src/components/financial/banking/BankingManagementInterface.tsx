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
    DollarSign,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Loader2
} from 'lucide-react';
import {
    bankingService,
    type BankAccount,
    type BankAccountDetails,
    type CreateBankAccountData
} from '../../../services/api/bankingService';
import { apiService } from '../../../services/api/apiService';

// Entity interface (reuse from existing services)
interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
}

const BankingManagementInterface: React.FC = () => {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [viewingAccount, setViewingAccount] = useState<BankAccountDetails | null>(null);
    const [formData, setFormData] = useState<CreateBankAccountData>({
        bankName: '',
        accountName: '',
        accountNumber: '',
        accountType: 'CHECKING',
        routingNumber: '',
        notes: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Load bank accounts when entity changes
    useEffect(() => {
        if (selectedEntity) {
            loadBankAccounts();
        }
    }, [selectedEntity]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            // Use existing apiService to get entities (maintain consistency)
            const entitiesResponse = await apiService.getEntities();
            setEntities(entitiesResponse.data || []);

            // Auto-select first entity if available
            if (entitiesResponse.data && entitiesResponse.data.length > 0) {
                setSelectedEntity(entitiesResponse.data[0].id);
            }
        } catch (err) {
            setError(`Failed to load entities: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const loadBankAccounts = async () => {
        if (!selectedEntity) return;

        try {
            setRefreshing(true);
            const accounts = await bankingService.getBankAccounts(selectedEntity);
            setBankAccounts(accounts);
        } catch (err) {
            setError(`Failed to load bank accounts: ${err.message}`);
        } finally {
            setRefreshing(false);
        }
    };

    const handleEntityChange = (entityId: string) => {
        setSelectedEntity(entityId);
        setBankAccounts([]); // Clear existing accounts while loading
    };

    const handleAddAccount = () => {
        setEditingAccount(null);
        setFormData({
            bankName: '',
            accountName: '',
            accountNumber: '',
            accountType: 'CHECKING',
            routingNumber: '',
            notes: ''
        });
        setShowAddModal(true);
    };

    const handleEditAccount = (account: BankAccount) => {
        setEditingAccount(account);
        setFormData({
            bankName: account.bankName,
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            routingNumber: account.routingNumber || '',
            notes: account.notes || ''
        });
        setShowAddModal(true);
    };

    const handleViewAccount = async (account: BankAccount) => {
        try {
            setSubmitting(true);
            const details = await bankingService.getBankAccountDetails(selectedEntity, account.id);
            setViewingAccount(details);
            setShowViewModal(true);
        } catch (err) {
            setError(`Failed to load account details: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveAccount = async () => {
        if (!selectedEntity) return;

        try {
            setSubmitting(true);
            setError(null);

            if (editingAccount) {
                // Update existing account
                const updatedAccount = await bankingService.updateBankAccount(
                    selectedEntity,
                    editingAccount.id,
                    formData
                );
                setBankAccounts(prev => prev.map(acc =>
                    acc.id === editingAccount.id ? updatedAccount : acc
                ));
                setSuccess('Bank account updated successfully!');
            } else {
                // Create new account
                const newAccount = await bankingService.createBankAccount(selectedEntity, formData);
                setBankAccounts(prev => [...prev, newAccount]);
                setSuccess('Bank account created successfully!');
            }

            setShowAddModal(false);
            setEditingAccount(null);
        } catch (err) {
            setError(`Failed to save account: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAccount = async (account: BankAccount) => {
        const confirmMessage = `Are you sure you want to deactivate "${account.accountName}"? This action will mark the account as inactive but preserve all transaction history.`;

        if (window.confirm(confirmMessage)) {
            try {
                setSubmitting(true);
                await bankingService.deactivateBankAccount(selectedEntity, account.id);
                setBankAccounts(prev => prev.filter(acc => acc.id !== account.id));
                setSuccess('Bank account deactivated successfully!');
            } catch (err) {
                setError(`Failed to deactivate account: ${err.message}`);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleRefresh = () => {
        loadBankAccounts();
    };

    const formatCurrency = (amount: number) => {
        console.log('Amount', amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getAccountTypeLabel = (type: string) => {
        const labels = {
            'CHECKING': 'Checking',
            'SAVINGS': 'Savings',
            'MONEY_MARKET': 'Money Market',
            'CD': 'Certificate of Deposit',
            'INVESTMENT': 'Investment Account'
        };
        return labels[type] || type;
    };

    const getAccountTypeColor = (type: string) => {
        const colors = {
            'CHECKING': 'stat-icon-blue',
            'SAVINGS': 'stat-icon-green',
            'MONEY_MARKET': 'stat-icon-purple',
            'CD': 'stat-icon-orange',
            'INVESTMENT': 'stat-icon-purple'
        };
        return colors[type] || 'stat-icon-blue';
    };

    // Auto-clear messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    if (loading) {
        return (
            <div className="properties-loading">
                <Loader2 className="animate-spin" style={{ width: '2rem', height: '2rem', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    Loading Banking Information...
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Connecting to banking API and fetching account data
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Success/Error Messages */}
            {success && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: '#059669',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                    {success}
                </div>
            )}

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <AlertTriangle style={{ width: '1.25rem', height: '1.25rem' }} />
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="properties-header">
                <div>
                    <h1 className="properties-title">Banking Management</h1>
                    <p className="properties-subtitle">
                        Manage bank accounts and financial information for your entities
                    </p>
                </div>
                <div className="properties-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleRefresh}
                        disabled={refreshing || !selectedEntity}
                        style={{ opacity: (refreshing || !selectedEntity) ? 0.5 : 1 }}
                    >
                        <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleAddAccount}
                        disabled={!selectedEntity}
                        style={{ opacity: !selectedEntity ? 0.5 : 1 }}
                    >
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Add Bank Account
                    </button>
                </div>
            </div>

            {/* Entity Selector */}
            <div className="properties-toolbar">
                <div className="search-container">
                    <Building2 className="search-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
                    <select
                        className="search-input"
                        value={selectedEntity}
                        onChange={(e) => handleEntityChange(e.target.value)}
                        style={{ paddingLeft: '3rem' }}
                        disabled={entities.length === 0}
                    >
                        <option value="">Select Entity</option>
                        {entities.map(entity => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name} ({entity.entityType})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {refreshing && <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />}
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        {bankAccounts.length} bank accounts
                    </span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className={`stat-icon stat-icon-blue`}>
                            <CreditCard style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div className="stat-trend stat-trend-up">
                            <TrendingUp style={{ width: '0.875rem', height: '0.875rem' }} />
                            +2.5%
                        </div>
                    </div>
                    <div className="stat-value">
                        {/* {formatCurrency(bankAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0))} */}
                        {formatCurrency(bankAccounts.reduce((sum, acc) => {
                            const balance = typeof acc.currentBalance === 'string'
                                ? parseFloat(acc.currentBalance)
                                : acc.currentBalance;
                            return sum + (isNaN(balance) ? 0 : balance);
                        }, 0))}
                    </div>
                    <div className="stat-label">Total Balance</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <Building2 style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{bankAccounts.filter(acc => acc.isActive).length}</div>
                    <div className="stat-label">Active Accounts</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <CheckCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{bankAccounts.length}</div>
                    <div className="stat-label">Total Accounts</div>
                </div>
            </div>

            {/* Bank Accounts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {bankAccounts.map(account => (
                    <div key={account.id} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '300px' }}>
                                <div className={`stat-icon ${getAccountTypeColor(account.accountType)}`} style={{ width: '3rem', height: '3rem', flexShrink: 0 }}>
                                    <CreditCard style={{ width: '1.5rem', height: '1.5rem' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.25rem', margin: 0 }}>
                                        {account.accountName}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--gray-500)',
                                        flexWrap: 'wrap',
                                        marginTop: '0.25rem'
                                    }}>
                                        <span>{account.bankName}</span>
                                        <span>•</span>
                                        <span>{getAccountTypeLabel(account.accountType)}</span>
                                        <span>•</span>
                                        <span>Account {account.accountNumber}</span>
                                        {!account.isActive && (
                                            <>
                                                <span>•</span>
                                                <span style={{ color: '#dc2626', fontWeight: '500' }}>INACTIVE</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                    {formatCurrency(account.currentBalance)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                    Current Balance
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--gray-200)',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                Last updated {new Date(account.updatedAt).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleViewAccount(account)}
                                    title="View Details"
                                    disabled={submitting}
                                >
                                    <Eye style={{ width: '1rem', height: '1rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleEditAccount(account)}
                                    title="Edit Account"
                                    disabled={submitting}
                                >
                                    <Edit style={{ width: '1rem', height: '1rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleDeleteAccount(account)}
                                    title="Deactivate Account"
                                    style={{ color: '#dc2626' }}
                                    disabled={submitting}
                                >
                                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {bankAccounts.length === 0 && selectedEntity && !refreshing && (
                    <div className="page-placeholder">
                        <CreditCard style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Bank Accounts Found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Get started by adding your first bank account for this entity.</p>
                        <button className="btn btn-primary" onClick={handleAddAccount}>
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            Add Bank Account
                        </button>
                    </div>
                )}

                {!selectedEntity && (
                    <div className="page-placeholder">
                        <Building2 style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select an Entity</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Choose an entity from the dropdown above to view and manage its bank accounts.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Account Modal */}
            {showAddModal && (
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
                    <div className="card" style={{ width: '100%', maxWidth: '28rem', margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingAccount(null);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--gray-500)'
                                }}
                                disabled={submitting}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Bank Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                                    placeholder="Enter bank name"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="form-label">Account Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.accountName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                                    placeholder="Enter account name"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="form-label">Account Type *</label>
                                <select
                                    className="form-input"
                                    value={formData.accountType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as any }))}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="CHECKING">Checking</option>
                                    <option value="SAVINGS">Savings</option>
                                    <option value="MONEY_MARKET">Money Market</option>
                                    <option value="CD">Certificate of Deposit</option>
                                    <option value="INVESTMENT">Investment Account</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Account Number *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                                    placeholder="Enter account number"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="form-label">Routing Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.routingNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                                    placeholder="Enter routing number (optional)"
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Optional notes about this account"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingAccount(null);
                                }}
                                style={{ flex: 1 }}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveAccount}
                                style={{
                                    flex: 1,
                                    opacity: submitting ? 0.7 : 1
                                }}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save style={{ width: '1rem', height: '1rem' }} />
                                        {editingAccount ? 'Update Account' : 'Add Account'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Account Details Modal */}
            {showViewModal && viewingAccount && (
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
                    <div className="card" style={{ width: '100%', maxWidth: '40rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                Bank Account Details
                            </h2>
                            <button
                                onClick={() => setShowViewModal(false)}
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

                        {/* Account Information */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                                Account Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account Name</div>
                                    <div style={{ fontWeight: '500' }}>{viewingAccount.accountName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Bank Name</div>
                                    <div style={{ fontWeight: '500' }}>{viewingAccount.bankName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account Type</div>
                                    <div style={{ fontWeight: '500' }}>{getAccountTypeLabel(viewingAccount.accountType)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account Number</div>
                                    <div style={{ fontWeight: '500' }}>{viewingAccount.accountNumber}</div>
                                </div>
                                {viewingAccount.routingNumber && (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Routing Number</div>
                                        <div style={{ fontWeight: '500' }}>{viewingAccount.routingNumber}</div>
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Current Balance</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--gray-900)' }}>
                                        {formatCurrency(viewingAccount.currentBalance)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                                Recent Transactions ({viewingAccount.recentTransactions?.length || 0})
                            </h3>
                            {viewingAccount.recentTransactions && viewingAccount.recentTransactions.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {viewingAccount.recentTransactions.map(transaction => (
                                        <div key={transaction.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.75rem',
                                            backgroundColor: 'var(--gray-50)',
                                            borderRadius: '0.5rem'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                                                    {transaction.description}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                    {new Date(transaction.transactionDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontWeight: '600',
                                                color: transaction.transactionType === 'DEBIT' ? '#dc2626' : '#059669'
                                            }}>
                                                {transaction.transactionType === 'DEBIT' ? '-' : '+'}
                                                {formatCurrency(Math.abs(transaction.amount))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: 'var(--gray-500)',
                                    fontSize: '0.875rem'
                                }}>
                                    No recent transactions found
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowViewModal(false)}
                                style={{ flex: 1 }}
                            >
                                Close
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowViewModal(false);
                                    handleEditAccount(viewingAccount);
                                }}
                                style={{ flex: 1 }}
                            >
                                <Edit style={{ width: '1rem', height: '1rem' }} />
                                Edit Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankingManagementInterface;