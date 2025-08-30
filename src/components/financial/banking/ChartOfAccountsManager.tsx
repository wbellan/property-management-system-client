import React, { useState, useEffect } from 'react';
import {
    Plus,
    Building2,
    TreePine,
    Eye,
    Edit,
    Trash2,
    X,
    Save,
    ChevronDown,
    ChevronRight,
    DollarSign,
    Settings,
    BookOpen,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

// Types based on your schema
interface ChartAccount {
    id: string;
    entityId: string;
    accountCode: string;
    accountName: string;
    description?: string;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    parentId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    children?: ChartAccount[];
    currentBalance?: number;
}

interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
}

const ChartOfAccountsManager: React.FC = () => {
    const [accounts, setAccounts] = useState<ChartAccount[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<ChartAccount | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [showCreateDefault, setShowCreateDefault] = useState(false);
    const [formData, setFormData] = useState({
        accountCode: '',
        accountName: '',
        description: '',
        accountType: 'ASSET' as const,
        parentId: ''
    });

    // Mock data for demo
    useEffect(() => {
        setTimeout(() => {
            setEntities([
                { id: '1', name: 'Sunset Properties LLC', legalName: 'Sunset Properties LLC', entityType: 'LLC' },
                { id: '2', name: 'Downtown Investments', legalName: 'Downtown Investments Inc.', entityType: 'CORPORATION' },
                { id: '3', name: 'Harbor View Properties', legalName: 'Harbor View Properties Partnership', entityType: 'PARTNERSHIP' }
            ]);
            setSelectedEntity('1');
            setAccounts([
                // Assets
                { id: '1', entityId: '1', accountCode: '1000', accountName: 'Assets', accountType: 'ASSET', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 175000 },
                { id: '2', entityId: '1', accountCode: '1001', accountName: 'Cash and Cash Equivalents', accountType: 'ASSET', parentId: '1', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 125000 },
                { id: '3', entityId: '1', accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'ASSET', parentId: '1', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 15000 },
                { id: '4', entityId: '1', accountCode: '1200', accountName: 'Security Deposits Held', accountType: 'ASSET', parentId: '1', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 35000 },

                // Liabilities
                { id: '5', entityId: '1', accountCode: '2000', accountName: 'Liabilities', accountType: 'LIABILITY', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 42000 },
                { id: '6', entityId: '1', accountCode: '2100', accountName: 'Security Deposits Payable', accountType: 'LIABILITY', parentId: '5', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 35000 },
                { id: '7', entityId: '1', accountCode: '2200', accountName: 'Accounts Payable', accountType: 'LIABILITY', parentId: '5', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 7000 },

                // Equity
                { id: '8', entityId: '1', accountCode: '3000', accountName: 'Equity', accountType: 'EQUITY', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 100000 },
                { id: '9', entityId: '1', accountCode: '3100', accountName: 'Owner Equity', accountType: 'EQUITY', parentId: '8', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 80000 },
                { id: '10', entityId: '1', accountCode: '3200', accountName: 'Retained Earnings', accountType: 'EQUITY', parentId: '8', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 20000 },

                // Revenue
                { id: '11', entityId: '1', accountCode: '4000', accountName: 'Revenue', accountType: 'REVENUE', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 25000 },
                { id: '12', entityId: '1', accountCode: '4100', accountName: 'Rental Income', accountType: 'REVENUE', parentId: '11', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 22000 },
                { id: '13', entityId: '1', accountCode: '4200', accountName: 'Late Fees', accountType: 'REVENUE', parentId: '11', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 3000 },

                // Expenses
                { id: '14', entityId: '1', accountCode: '5000', accountName: 'Expenses', accountType: 'EXPENSE', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 8000 },
                { id: '15', entityId: '1', accountCode: '5100', accountName: 'Maintenance and Repairs', accountType: 'EXPENSE', parentId: '14', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 4500 },
                { id: '16', entityId: '1', accountCode: '5200', accountName: 'Utilities', accountType: 'EXPENSE', parentId: '14', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 2000 },
                { id: '17', entityId: '1', accountCode: '5300', accountName: 'Insurance', accountType: 'EXPENSE', parentId: '14', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15', currentBalance: 1500 }
            ]);
            setExpandedNodes(new Set(['1', '5', '8', '11', '14'])); // Expand main categories by default
            setLoading(false);
        }, 1000);
    }, []);

    const buildAccountHierarchy = (accounts: ChartAccount[]): ChartAccount[] => {
        const accountMap = new Map<string, ChartAccount>();
        const rootAccounts: ChartAccount[] = [];

        // Create map of all accounts with children arrays
        accounts.forEach(account => {
            accountMap.set(account.id, { ...account, children: [] });
        });

        // Build hierarchy
        accounts.forEach(account => {
            if (account.parentId) {
                const parent = accountMap.get(account.parentId);
                if (parent && parent.children) {
                    parent.children.push(accountMap.get(account.id)!);
                }
            } else {
                rootAccounts.push(accountMap.get(account.id)!);
            }
        });

        return rootAccounts.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
    };

    const getAccountTypeColor = (type: string) => {
        const colors = {
            'ASSET': 'stat-icon-blue',
            'LIABILITY': 'stat-icon-orange',
            'EQUITY': 'stat-icon-purple',
            'REVENUE': 'stat-icon-green',
            'EXPENSE': 'stat-icon-orange'
        };
        return colors[type] || 'stat-icon-blue';
    };

    const getAccountTypeIcon = (type: string) => {
        const icons = {
            'ASSET': DollarSign,
            'LIABILITY': AlertTriangle,
            'EQUITY': BookOpen,
            'REVENUE': CheckCircle,
            'EXPENSE': Settings
        };
        return icons[type] || DollarSign;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleEntityChange = (entityId: string) => {
        setSelectedEntity(entityId);
        // In real app, fetch chart of accounts for this entity
    };

    const handleAddAccount = (parentId?: string) => {
        setFormData({
            accountCode: '',
            accountName: '',
            description: '',
            accountType: 'ASSET',
            parentId: parentId || ''
        });
        setShowAddModal(true);
    };

    const handleEditAccount = (account: ChartAccount) => {
        setEditingAccount(account);
        setFormData({
            accountCode: account.accountCode,
            accountName: account.accountName,
            description: account.description || '',
            accountType: account.accountType,
            parentId: account.parentId || ''
        });
        setShowAddModal(true);
    };

    const handleSaveAccount = () => {
        // In real app, make API call to save/update account
        console.log('Saving account:', formData);
        setShowAddModal(false);
        setEditingAccount(null);
    };

    const handleDeleteAccount = (accountId: string) => {
        if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            // In real app, make API call to delete account
            setAccounts(prev => prev.filter(acc => acc.id !== accountId));
        }
    };

    const handleCreateDefaultChart = () => {
        if (window.confirm('This will create a standard chart of accounts for this entity. Continue?')) {
            // In real app, make API call to create default chart
            console.log('Creating default chart for entity:', selectedEntity);
            setShowCreateDefault(false);
        }
    };

    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const renderAccountNode = (account: ChartAccount, level = 0) => {
        const hasChildren = account.children && account.children.length > 0;
        const isExpanded = expandedNodes.has(account.id);
        const IconComponent = getAccountTypeIcon(account.accountType);

        return (
            <div key={account.id}>
                <div className="card" style={{
                    padding: level === 0 ? '1.5rem' : '1rem',
                    marginBottom: '0.5rem',
                    marginLeft: level > 0 ? `${level * 2}rem` : '0',
                    border: level > 0 ? '1px solid var(--gray-200)' : '1px solid var(--gray-300)',
                    backgroundColor: level > 0 ? 'rgba(249, 250, 251, 0.5)' : undefined
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        {/* Left side - Account info */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            flex: '1',
                            minWidth: '300px'
                        }}>
                            {/* Expand/collapse button */}
                            {hasChildren && (
                                <button
                                    onClick={() => toggleNode(account.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        borderRadius: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'var(--gray-600)',
                                        flexShrink: 0
                                    }}
                                >
                                    {isExpanded ?
                                        <ChevronDown style={{ width: '1rem', height: '1rem' }} /> :
                                        <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                                    }
                                </button>
                            )}

                            {/* Account icon */}
                            <div className={`stat-icon ${getAccountTypeColor(account.accountType)}`}
                                style={{
                                    width: level === 0 ? '2.5rem' : '2rem',
                                    height: level === 0 ? '2.5rem' : '2rem',
                                    flexShrink: 0
                                }}>
                                <IconComponent style={{
                                    width: level === 0 ? '1.25rem' : '1rem',
                                    height: level === 0 ? '1.25rem' : '1rem'
                                }} />
                            </div>

                            {/* Account details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '0.75rem',
                                    marginBottom: '0.25rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        fontSize: level === 0 ? '1.125rem' : '1rem',
                                        fontWeight: level === 0 ? '700' : '600',
                                        color: 'var(--gray-900)',
                                        flexShrink: 0
                                    }}>
                                        {account.accountCode}
                                    </span>
                                    <span style={{
                                        fontSize: level === 0 ? '1.125rem' : '1rem',
                                        fontWeight: level === 0 ? '600' : '500',
                                        color: 'var(--gray-900)',
                                        wordBreak: 'break-word'
                                    }}>
                                        {account.accountName}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--gray-500)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        background: 'var(--gray-100)',
                                        padding: '0.125rem 0.5rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '500'
                                    }}>
                                        {account.accountType}
                                    </span>
                                    {account.description && (
                                        <span style={{ wordBreak: 'break-word' }}>
                                            {account.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side - Balance and actions */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flexShrink: 0
                        }}>
                            {/* Balance */}
                            {account.currentBalance !== undefined && (
                                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                    <div style={{
                                        fontSize: level === 0 ? '1.125rem' : '1rem',
                                        fontWeight: '600',
                                        color: 'var(--gray-900)'
                                    }}>
                                        {formatCurrency(account.currentBalance)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                        Balance
                                    </div>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                {level > 0 && (
                                    <button
                                        className="maintenance-action-btn"
                                        onClick={() => handleAddAccount(account.id)}
                                        title="Add Sub-Account"
                                    >
                                        <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                                    </button>
                                )}
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
                                {level > 0 && (
                                    <button
                                        className="maintenance-action-btn"
                                        onClick={() => handleDeleteAccount(account.id)}
                                        title="Delete Account"
                                        style={{ color: '#dc2626' }}
                                    >
                                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render children */}
                {hasChildren && isExpanded && (
                    <div style={{ marginLeft: '1rem' }}>
                        {account.children?.map(child =>
                            renderAccountNode(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="properties-loading">
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    Loading Chart of Accounts...
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Fetching accounting structure and account data
                </div>
            </div>
        );
    }

    const hierarchyAccounts = buildAccountHierarchy(accounts);

    return (
        // <div className="properties-container">
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Header */}
            <div className="properties-header">
                <div>
                    <h1 className="properties-title">Chart of Accounts</h1>
                    <p className="properties-subtitle">
                        Manage your accounting structure and track account balances
                    </p>
                </div>
                <div className="properties-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowCreateDefault(true)}
                    >
                        <Settings style={{ width: '1rem', height: '1rem' }} />
                        Setup Default Chart
                    </button>
                    <button className="btn btn-primary" onClick={() => handleAddAccount()}>
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Add Account
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
                        {accounts.length} accounts
                    </span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(accounts.filter(a => a.accountType === 'ASSET').reduce((sum, a) => sum + (a.currentBalance || 0), 0))}
                    </div>
                    <div className="stat-label">Total Assets</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <AlertTriangle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(accounts.filter(a => a.accountType === 'LIABILITY').reduce((sum, a) => sum + (a.currentBalance || 0), 0))}
                    </div>
                    <div className="stat-label">Total Liabilities</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <CheckCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(accounts.filter(a => a.accountType === 'REVENUE').reduce((sum, a) => sum + (a.currentBalance || 0), 0))}
                    </div>
                    <div className="stat-label">Total Revenue</div>
                </div>
            </div>

            {/* Account Hierarchy */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {hierarchyAccounts.length > 0 ? (
                    hierarchyAccounts.map(account => renderAccountNode(account))
                ) : (
                    <div className="page-placeholder">
                        <TreePine style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Chart of Accounts Found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Create a standard chart of accounts to get started with proper bookkeeping.</p>
                        <button className="btn btn-primary" onClick={() => setShowCreateDefault(true)}>
                            <Settings style={{ width: '1rem', height: '1rem' }} />
                            Setup Default Chart
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
                                {editingAccount ? 'Edit Account' : 'Add Account'}
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
                                <label className="form-label">Account Code *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.accountCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accountCode: e.target.value }))}
                                    placeholder="e.g., 1001"
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
                                    <option value="ASSET">Asset</option>
                                    <option value="LIABILITY">Liability</option>
                                    <option value="EQUITY">Equity</option>
                                    <option value="REVENUE">Revenue</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Parent Account</label>
                                <select
                                    className="form-input"
                                    value={formData.parentId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                                >
                                    <option value="">No Parent (Top Level)</option>
                                    {accounts
                                        .filter(acc => acc.accountType === formData.accountType && acc.id !== editingAccount?.id)
                                        .map(account => (
                                            <option key={account.id} value={account.id}>
                                                {account.accountCode} - {account.accountName}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Description</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Optional description"
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

            {/* Create Default Chart Modal */}
            {showCreateDefault && (
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
                                Setup Default Chart of Accounts
                            </h2>
                            <button
                                onClick={() => setShowCreateDefault(false)}
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

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
                                This will create a standard property management chart of accounts including:
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                <li>Asset accounts (Cash, Receivables, Security Deposits)</li>
                                <li>Liability accounts (Payables, Security Deposit Liabilities)</li>
                                <li>Equity accounts (Owner Equity, Retained Earnings)</li>
                                <li>Revenue accounts (Rental Income, Fees)</li>
                                <li>Expense accounts (Maintenance, Utilities, Insurance)</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowCreateDefault(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleCreateDefaultChart}
                                style={{ flex: 1 }}
                            >
                                <Settings style={{ width: '1rem', height: '1rem' }} />
                                Create Default Chart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartOfAccountsManager;