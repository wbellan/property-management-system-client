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
    CheckCircle
} from 'lucide-react';

// Types based on our banking module schema
interface BankAccount {
    id: string;
    entityId: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'CD' | 'INVESTMENT';
    routingNumber?: string;
    currentBalance: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

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
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        accountType: 'CHECKING' as const,
        routingNumber: ''
    });

    // Mock data for demo - replace with actual API calls
    useEffect(() => {
        // Simulate API loading
        setTimeout(() => {
            setEntities([
                { id: '1', name: 'Sunset Properties LLC', legalName: 'Sunset Properties LLC', entityType: 'LLC' },
                { id: '2', name: 'Downtown Investments', legalName: 'Downtown Investments Inc.', entityType: 'CORPORATION' },
                { id: '3', name: 'Harbor View Properties', legalName: 'Harbor View Properties Partnership', entityType: 'PARTNERSHIP' }
            ]);
            setSelectedEntity('1');
            setBankAccounts([
                {
                    id: '1',
                    entityId: '1',
                    bankName: 'Chase Bank',
                    accountName: 'Sunset Operating Account',
                    accountNumber: '****4567',
                    accountType: 'CHECKING',
                    routingNumber: '021000021',
                    currentBalance: 125000.50,
                    isActive: true,
                    createdAt: '2024-01-15T10:30:00Z',
                    updatedAt: '2024-01-20T14:22:00Z'
                },
                {
                    id: '2',
                    entityId: '1',
                    bankName: 'Bank of America',
                    accountName: 'Sunset Savings Account',
                    accountType: 'SAVINGS',
                    accountNumber: '****8901',
                    currentBalance: 50000.00,
                    isActive: true,
                    createdAt: '2024-01-10T09:15:00Z',
                    updatedAt: '2024-01-18T16:45:00Z'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleEntityChange = (entityId: string) => {
        setSelectedEntity(entityId);
        // In real app, fetch bank accounts for this entity
    };

    const handleAddAccount = () => {
        setFormData({
            bankName: '',
            accountName: '',
            accountNumber: '',
            accountType: 'CHECKING',
            routingNumber: ''
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
            routingNumber: account.routingNumber || ''
        });
        setShowAddModal(true);
    };

    const handleSaveAccount = async () => {
        // In real app, make API call to save/update account
        console.log('Saving account:', formData);
        setShowAddModal(false);
        setEditingAccount(null);
    };

    const handleDeleteAccount = async (accountId: string) => {
        if (window.confirm('Are you sure you want to delete this bank account? This action cannot be undone.')) {
            // In real app, make API call to delete account
            setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
        }
    };

    const formatCurrency = (amount: number) => {
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

    if (loading) {
        return (
            <div className="properties-loading">
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    Loading Banking Information...
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Fetching bank accounts and entity data
                </div>
            </div>
        );
    }

    return (
        // <div className="properties-container">
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Header */}
            {/* <div className="properties-header">
                <div>
                    <h1 className="properties-title">Banking Management</h1>
                    <p className="properties-subtitle">
                        Manage bank accounts and financial information for your entities
                    </p>
                </div>
                <div className="properties-actions">
                    <button className="btn btn-primary" onClick={handleAddAccount}>
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Add Bank Account
                    </button>
                </div>
            </div> */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>
                            Banking Management
                        </h1>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
                            Manage bank accounts and financial information for your entities
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-primary" onClick={handleAddAccount}>
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            Add Bank Account
                        </button>
                    </div>
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
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        {bankAccounts.length} bank accounts
                    </span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className={`stat-icon ${getAccountTypeColor('CHECKING')}`}>
                            <CreditCard style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div className="stat-trend stat-trend-up">
                            <TrendingUp style={{ width: '0.875rem', height: '0.875rem' }} />
                            +2.5%
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(bankAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0))}
                    </div>
                    <div className="stat-label">Total Balance</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <Building2 style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{bankAccounts.length}</div>
                    <div className="stat-label">Active Accounts</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <CheckCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">100%</div>
                    <div className="stat-label">Reconciled This Month</div>
                </div>
            </div>

            {/* Bank Accounts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {bankAccounts.map(account => (
                    <div key={account.id} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '300px' }}>
                                <div className={`stat-icon ${getAccountTypeColor(account.accountType)}`} style={{ width: '3rem', height: '3rem', flexShrink: 0 }}>
                                    <CreditCard style={{ width: '1.5rem', height: '1.5rem' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.5rem', margin: 0 }}>
                                        {account.accountName}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--gray-500)',
                                        flexWrap: 'wrap',
                                        marginTop: '0.25rem'
                                    }}>
                                        <span>{account.bankName}</span>
                                        <span style={{ display: 'none' }}>•</span>
                                        <span>{getAccountTypeLabel(account.accountType)}</span>
                                        <span style={{ display: 'none' }}>•</span>
                                        <span>Account {account.accountNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-900)', margin: 0 }}>
                                    {formatCurrency(account.currentBalance)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
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
                                    title="View Details"
                                >
                                    <Eye style={{ width: '1rem', height: '1rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleEditAccount(account)}
                                    title="Edit Account"
                                >
                                    <Edit style={{ width: '1rem', height: '1rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    title="Delete Account"
                                    style={{ color: '#dc2626' }}
                                >
                                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {bankAccounts.length === 0 && selectedEntity && (
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
                                />
                            </div>

                            <div>
                                <label className="form-label">Account Type *</label>
                                <select
                                    className="form-input"
                                    value={formData.accountType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as any }))}
                                    required
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
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveAccount}
                                style={{ flex: 1 }}
                            >
                                <Save style={{ width: '1rem', height: '1rem' }} />
                                {editingAccount ? 'Update Account' : 'Add Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankingManagementInterface;