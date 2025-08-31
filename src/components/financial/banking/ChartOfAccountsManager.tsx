import React, { useState, useEffect } from 'react';
import {
    Plus,
    Building2,
    BookOpen,
    Eye,
    Edit,
    Trash2,
    X,
    Save,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Loader2,
    ChevronRight,
    ChevronDown,
    Settings,
    TrendingUp,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import {
    bankingService,
    type ChartAccount,
    type CreateChartAccountData
} from '../../../services/api/bankingService';
import { apiService } from '../../../services/api/apiService';

// Entity interface (reuse from existing services)
interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
}

// Extended ChartAccount with children for tree view
interface ChartAccountWithChildren extends ChartAccount {
    children?: ChartAccountWithChildren[];
}

const ChartOfAccountsManager: React.FC = () => {
    const [chartAccounts, setChartAccounts] = useState<ChartAccount[]>([]);
    const [hierarchicalAccounts, setHierarchicalAccounts] = useState<ChartAccountWithChildren[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDefaultSetupModal, setShowDefaultSetupModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<ChartAccount | null>(null);
    const [viewingAccount, setViewingAccount] = useState<ChartAccount | null>(null);
    const [parentAccountForAdd, setParentAccountForAdd] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState<CreateChartAccountData>({
        accountCode: '',
        accountName: '',
        accountType: 'ASSET',
        parentId: '',
        description: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Load chart accounts when entity changes
    useEffect(() => {
        if (selectedEntity) {
            loadChartAccounts();
        }
    }, [selectedEntity]);

    // Build hierarchy when accounts change
    useEffect(() => {
        const hierarchy = buildAccountHierarchy(chartAccounts);
        setHierarchicalAccounts(hierarchy);

        // Always auto-expand nodes that have children (so sub-accounts are visible)
        const findNodesWithChildren = (accounts: ChartAccountWithChildren[]): string[] => {
            const nodesWithChildren: string[] = [];
            accounts.forEach(account => {
                if (account.children && account.children.length > 0) {
                    nodesWithChildren.push(account.id);
                    // Recursively find nested parent nodes
                    nodesWithChildren.push(...findNodesWithChildren(account.children));
                }
            });
            return nodesWithChildren;
        };

        const parentNodes = findNodesWithChildren(hierarchy);

        // Always set expanded nodes - include both parent nodes AND root nodes
        const allNodesToExpand = [...parentNodes];

        // Also include root nodes if we don't have many accounts
        if (hierarchy.length <= 10) {
            hierarchy.forEach(acc => {
                if (!allNodesToExpand.includes(acc.id)) {
                    allNodesToExpand.push(acc.id);
                }
            });
        }

        setExpandedNodes(new Set(allNodesToExpand));
    }, [chartAccounts]); // Remove expandedNodes dependency to avoid issues

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

    const loadChartAccounts = async () => {
        if (!selectedEntity) return;

        try {
            setRefreshing(true);
            const accounts = await bankingService.getChartAccounts(selectedEntity);
            setChartAccounts(accounts);
        } catch (err) {
            setError(`Failed to load chart of accounts: ${err.message}`);
        } finally {
            setRefreshing(false);
        }
    };

    const buildAccountHierarchy = (accounts: ChartAccount[]): ChartAccountWithChildren[] => {
        const accountMap = new Map<string, ChartAccountWithChildren>();
        const rootAccounts: ChartAccountWithChildren[] = [];

        // Create map with children arrays
        accounts.forEach(account => {
            accountMap.set(account.id, { ...account, children: [] });
        });

        // Build hierarchy
        accounts.forEach(account => {
            const accountWithChildren = accountMap.get(account.id)!;
            if (account.parentId) {
                const parent = accountMap.get(account.parentId);
                if (parent && parent.children) {
                    parent.children.push(accountWithChildren);
                } else {
                    // If parent not found, treat as root account
                    rootAccounts.push(accountWithChildren);
                }
            } else {
                rootAccounts.push(accountWithChildren);
            }
        });

        // Sort by account code
        const sortAccounts = (accounts: ChartAccountWithChildren[]) => {
            accounts.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
            accounts.forEach(account => {
                if (account.children && account.children.length > 0) {
                    sortAccounts(account.children);
                }
            });
        };

        sortAccounts(rootAccounts);
        return rootAccounts;
    };

    const handleEntityChange = (entityId: string) => {
        setSelectedEntity(entityId);
        setChartAccounts([]);
        setExpandedNodes(new Set());
    };

    const handleAddAccount = (parentId?: string) => {
        setEditingAccount(null);
        setParentAccountForAdd(parentId || null);

        // If adding as child, inherit parent's account type for compatibility
        let defaultAccountType = 'ASSET';
        if (parentId) {
            const parent = chartAccounts.find(acc => acc.id === parentId);
            if (parent) {
                defaultAccountType = parent.accountType;
            }
        }

        setFormData({
            accountCode: '',
            accountName: '',
            accountType: defaultAccountType as any,
            parentId: parentId || '',
            description: ''
        });
        setShowAddModal(true);
    };

    const handleEditAccount = (account: ChartAccount) => {
        setEditingAccount(account);
        setParentAccountForAdd(null);
        setFormData({
            accountCode: account.accountCode,
            accountName: account.accountName,
            accountType: account.accountType,
            parentId: account.parentId || '',
            description: account.description || ''
        });
        setShowAddModal(true);
    };

    const handleViewAccount = (account: ChartAccount) => {
        setViewingAccount(account);
        setShowViewModal(true);
    };

    const handleSaveAccount = async () => {
        if (!selectedEntity) return;

        try {
            setSubmitting(true);
            setError(null);

            // Prepare data with proper null handling for parentId
            const dataToSend = {
                ...formData,
                parentId: formData.parentId && formData.parentId.trim() !== '' ? formData.parentId : null
            };

            if (editingAccount) {
                // Update existing account
                const updatedAccount = await bankingService.updateChartAccount(
                    selectedEntity,
                    editingAccount.id,
                    dataToSend
                );
                setChartAccounts(prev => prev.map(acc =>
                    acc.id === editingAccount.id ? updatedAccount : acc
                ));
                setSuccess('Chart account updated successfully!');
            } else {
                // Create new account
                const newAccount = await bankingService.createChartAccount(selectedEntity, dataToSend);
                setChartAccounts(prev => [...prev, newAccount]);
                setSuccess('Chart account created successfully!');
            }

            setShowAddModal(false);
            setEditingAccount(null);
            setParentAccountForAdd(null);
        } catch (err) {
            setError(`Failed to save account: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAccount = async (account: ChartAccount) => {
        const hasChildren = chartAccounts.some(acc => acc.parentId === account.id);

        if (hasChildren) {
            setError('Cannot deactivate account with active child accounts. Please deactivate child accounts first.');
            return;
        }

        const confirmMessage = `Are you sure you want to deactivate "${account.accountName}"? This will mark the account as inactive but preserve all transaction history.`;

        if (window.confirm(confirmMessage)) {
            try {
                setSubmitting(true);
                await bankingService.deactivateChartAccount(selectedEntity, account.id);
                setChartAccounts(prev => prev.filter(acc => acc.id !== account.id));
                setSuccess('Chart account deactivated successfully!');
            } catch (err) {
                setError(`Failed to deactivate account: ${err.message}`);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleRefresh = () => {
        loadChartAccounts();
    };

    const handleSetupDefaultChart = async () => {
        if (!selectedEntity) return;

        try {
            setSubmitting(true);
            const response = await bankingService.setupDefaultChartAccounts(selectedEntity);

            if (response.accountsCreated && response.accountsCreated > 0) {
                setSuccess(`Successfully created ${response.accountsCreated} default accounts!`);
                // Reload the chart accounts to show the new accounts
                await loadChartAccounts();
            } else {
                setError(response.message || 'Entity already has chart of accounts');
            }

            setShowDefaultSetupModal(false);
        } catch (err) {
            setError(`Failed to setup default chart: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleNodeExpansion = (nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const getAccountTypeColor = (type: string) => {
        const colors = {
            'ASSET': 'stat-icon-blue',
            'LIABILITY': 'stat-icon-orange',
            'EQUITY': 'stat-icon-purple',
            'REVENUE': 'stat-icon-green',
            'EXPENSE': 'stat-icon-red'
        };
        return colors[type] || 'stat-icon-blue';
    };

    const getAccountTypeIcon = (type: string) => {
        switch (type) {
            case 'ASSET': return DollarSign;
            case 'LIABILITY': return AlertTriangle;
            case 'EQUITY': return BookOpen;
            case 'REVENUE': return CheckCircle;
            case 'EXPENSE': return Settings;
            default: return DollarSign;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getAccountTypeTotals = () => {
        const totals = {
            ASSET: 0,
            LIABILITY: 0,
            EQUITY: 0,
            REVENUE: 0,
            EXPENSE: 0
        };

        chartAccounts.forEach(account => {
            if (account.currentBalance) {
                const balance = typeof account.currentBalance === 'string'
                    ? parseFloat(account.currentBalance)
                    : account.currentBalance;
                totals[account.accountType] += (isNaN(balance) ? 0 : balance);
            }
        });

        return totals;
    };

    const renderAccountNode = (account: ChartAccountWithChildren, level: number = 0) => {
        const isExpanded = expandedNodes.has(account.id);
        const hasChildren = account.children && account.children.length > 0;
        const IconComponent = getAccountTypeIcon(account.accountType);

        return (
            <div key={account.id} style={{ marginBottom: '0.5rem' }}>
                <div
                    className="card"
                    style={{
                        padding: '1rem',
                        marginLeft: `${level * 1.5}rem`,
                        display: 'block',
                        backgroundColor: level > 0 ? 'var(--gray-25)' : 'white',
                        border: level > 0 ? '1px solid var(--gray-200)' : '1px solid var(--gray-300)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
                            {hasChildren && (
                                <button
                                    onClick={() => toggleNodeExpansion(account.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '0.25rem',
                                        cursor: 'pointer',
                                        borderRadius: '0.25rem',
                                        color: 'var(--gray-500)'
                                    }}
                                >
                                    {isExpanded ? (
                                        <ChevronDown style={{ width: '1rem', height: '1rem' }} />
                                    ) : (
                                        <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                                    )}
                                </button>
                            )}
                            {!hasChildren && <div style={{ width: '1.5rem' }} />}

                            <div className={`stat-icon ${getAccountTypeColor(account.accountType)}`} style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}>
                                <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)', margin: 0, marginBottom: '0.25rem' }}>
                                    {account.accountCode} - {account.accountName}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--gray-500)',
                                    flexWrap: 'wrap'
                                }}>
                                    <span>{account.accountType}</span>
                                    {account.parentId && (
                                        <>
                                            <span>•</span>
                                            <span>Sub-account</span>
                                        </>
                                    )}
                                    {!account.isActive && (
                                        <>
                                            <span>•</span>
                                            <span style={{ color: '#dc2626', fontWeight: '500' }}>INACTIVE</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                    {formatCurrency(
                                        typeof account.currentBalance === 'string'
                                            ? parseFloat(account.currentBalance) || 0
                                            : account.currentBalance || 0
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                    Current Balance
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleAddAccount(account.id)}
                                    title="Add Sub-Account"
                                    disabled={submitting}
                                >
                                    <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleViewAccount(account)}
                                    title="View Details"
                                    disabled={submitting}
                                >
                                    <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleEditAccount(account)}
                                    title="Edit Account"
                                    disabled={submitting}
                                >
                                    <Edit style={{ width: '0.875rem', height: '0.875rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    onClick={() => handleDeleteAccount(account)}
                                    title="Deactivate Account"
                                    style={{ color: '#dc2626' }}
                                    disabled={submitting}
                                >
                                    <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render children if expanded */}
                {isExpanded && hasChildren && (
                    <div style={{ marginTop: '0.5rem' }}>
                        {account.children!.map(child => renderAccountNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
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
                    Loading Chart of Accounts...
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Fetching account structure and balances
                </div>
            </div>
        );
    }

    const accountTypeTotals = getAccountTypeTotals();

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
                    <h1 className="properties-title">Chart of Accounts</h1>
                    <p className="properties-subtitle">
                        Manage your accounting structure and track balances by account type
                    </p>
                </div>
                <div className="properties-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowDefaultSetupModal(true)}
                        disabled={!selectedEntity || chartAccounts.length > 0}
                        style={{
                            opacity: (!selectedEntity || chartAccounts.length > 0) ? 0.5 : 1,
                            marginRight: '0.5rem'
                        }}
                        title={chartAccounts.length > 0 ? "Entity already has chart accounts" : "Setup default chart of accounts"}
                    >
                        <Settings style={{ width: '1rem', height: '1rem' }} />
                        Setup Default Chart
                    </button>
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
                        onClick={() => handleAddAccount()}
                        disabled={!selectedEntity}
                        style={{ opacity: !selectedEntity ? 0.5 : 1 }}
                    >
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
                        {chartAccounts.length} accounts
                    </span>
                </div>
            </div>

            {/* Account Type Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div className="stat-trend stat-trend-up">
                            <ArrowUp style={{ width: '0.875rem', height: '0.875rem' }} />
                            +5.2%
                        </div>
                    </div>
                    <div className="stat-value">{formatCurrency(accountTypeTotals.ASSET)}</div>
                    <div className="stat-label">Total Assets</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <AlertTriangle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div className="stat-trend stat-trend-down">
                            <ArrowDown style={{ width: '0.875rem', height: '0.875rem' }} />
                            -2.1%
                        </div>
                    </div>
                    <div className="stat-value">{formatCurrency(accountTypeTotals.LIABILITY)}</div>
                    <div className="stat-label">Total Liabilities</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <CheckCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div className="stat-trend stat-trend-up">
                            <TrendingUp style={{ width: '0.875rem', height: '0.875rem' }} />
                            +8.7%
                        </div>
                    </div>
                    <div className="stat-value">{formatCurrency(accountTypeTotals.REVENUE)}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <BookOpen style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{formatCurrency(accountTypeTotals.EQUITY)}</div>
                    <div className="stat-label">Total Equity</div>
                </div>
            </div>

            {/* Chart of Accounts Tree */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {hierarchicalAccounts.map(account => renderAccountNode(account))}

                {chartAccounts.length === 0 && selectedEntity && !refreshing && (
                    <div className="page-placeholder">
                        <BookOpen style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Chart of Accounts Found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Get started by setting up a default chart of accounts or creating your first custom account.</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowDefaultSetupModal(true)}
                                style={{ minWidth: '180px' }}
                            >
                                <Settings style={{ width: '1rem', height: '1rem' }} />
                                Setup Default Chart
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleAddAccount()}
                                style={{ minWidth: '150px' }}
                            >
                                <Plus style={{ width: '1rem', height: '1rem' }} />
                                Add First Account
                            </button>
                        </div>
                    </div>
                )}

                {!selectedEntity && (
                    <div className="page-placeholder">
                        <Building2 style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select an Entity</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Choose an entity from the dropdown above to view and manage its chart of accounts.</p>
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
                                {editingAccount ? 'Edit Account' : parentAccountForAdd ? 'Add Sub-Account' : 'Add Account'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingAccount(null);
                                    setParentAccountForAdd(null);
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
                                <label className="form-label">Account Code *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.accountCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accountCode: e.target.value }))}
                                    placeholder="Enter account code (e.g., 1100)"
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
                                    disabled={submitting || !!parentAccountForAdd}
                                >
                                    <option value="ASSET">Asset</option>
                                    <option value="LIABILITY">Liability</option>
                                    <option value="EQUITY">Equity</option>
                                    <option value="REVENUE">Revenue</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                                {parentAccountForAdd && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                                        Account type is inherited from parent account
                                    </div>
                                )}
                            </div>

                            {!parentAccountForAdd && (
                                <div>
                                    <label className="form-label">Parent Account</label>
                                    <select
                                        className="form-input"
                                        value={formData.parentId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                                        disabled={submitting}
                                    >
                                        <option value="">No Parent (Root Account)</option>
                                        {chartAccounts
                                            .filter(acc => acc.accountType === formData.accountType && acc.id !== editingAccount?.id)
                                            .map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.accountCode} - {account.accountName}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Optional description for this account"
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
                                    setParentAccountForAdd(null);
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

            {/* Setup Default Chart Modal */}
            {showDefaultSetupModal && (
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
                    <div className="card" style={{ width: '100%', maxWidth: '36rem', margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                Setup Default Chart of Accounts
                            </h2>
                            <button
                                onClick={() => setShowDefaultSetupModal(false)}
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

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
                                This will create a comprehensive property management chart of accounts designed for real estate businesses. This includes:
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <DollarSign style={{ width: '1rem', height: '1rem', color: '#2563eb' }} />
                                        <span style={{ fontWeight: '600', color: '#2563eb' }}>Assets</span>
                                    </div>
                                    <ul style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0, paddingLeft: '1rem' }}>
                                        <li>Cash & Bank Accounts</li>
                                        <li>Rent Receivables</li>
                                        <li>Security Deposits</li>
                                        <li>Property & Equipment</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '1rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#ea580c' }} />
                                        <span style={{ fontWeight: '600', color: '#ea580c' }}>Liabilities</span>
                                    </div>
                                    <ul style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0, paddingLeft: '1rem' }}>
                                        <li>Accounts Payable</li>
                                        <li>Security Deposits Held</li>
                                        <li>Mortgage Payable</li>
                                        <li>Accrued Expenses</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <CheckCircle style={{ width: '1rem', height: '1rem', color: '#059669' }} />
                                        <span style={{ fontWeight: '600', color: '#059669' }}>Revenue</span>
                                    </div>
                                    <ul style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0, paddingLeft: '1rem' }}>
                                        <li>Rental Income</li>
                                        <li>Late Fees</li>
                                        <li>Application Fees</li>
                                        <li>Other Income</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Settings style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                                        <span style={{ fontWeight: '600', color: '#dc2626' }}>Expenses</span>
                                    </div>
                                    <ul style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0, paddingLeft: '1rem' }}>
                                        <li>Maintenance & Repairs</li>
                                        <li>Utilities</li>
                                        <li>Insurance</li>
                                        <li>Property Management</li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(34, 197, 94, 0.05)',
                                border: '1px solid rgba(34, 197, 94, 0.2)',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <CheckCircle style={{ width: '1rem', height: '1rem', color: '#059669' }} />
                                    <span style={{ fontWeight: '600', color: '#059669' }}>Benefits:</span>
                                </div>
                                <ul style={{ fontSize: '0.875rem', color: 'var(--gray-700)', margin: 0, paddingLeft: '1rem' }}>
                                    <li>Industry-standard account structure for property management</li>
                                    <li>Organized hierarchy with parent-child account relationships</li>
                                    <li>Ready for immediate use with proper account codes</li>
                                    <li>Can be customized after creation to fit your specific needs</li>
                                </ul>
                            </div>

                            <div style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                borderRadius: '0.5rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#d97706' }} />
                                    <span style={{ fontWeight: '600', color: '#d97706' }}>Note:</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', margin: 0 }}>
                                    This feature is only available for entities with no existing chart of accounts. Once created, you can modify, add, or deactivate accounts as needed.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDefaultSetupModal(false)}
                                style={{ flex: 1 }}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSetupDefaultChart}
                                style={{
                                    flex: 1,
                                    opacity: submitting ? 0.7 : 1
                                }}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                                        Setting up...
                                    </>
                                ) : (
                                    <>
                                        <Settings style={{ width: '1rem', height: '1rem' }} />
                                        Create Default Chart
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
                    <div className="card" style={{ width: '100%', maxWidth: '32rem', margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                Account Details
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account Code</div>
                                    <div style={{ fontWeight: '500' }}>{viewingAccount.accountCode}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account Name</div>
                                    <div style={{ fontWeight: '500' }}>{viewingAccount.accountName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account Type</div>
                                    <div style={{ fontWeight: '500' }}>{viewingAccount.accountType}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Current Balance</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--gray-900)' }}>
                                        {formatCurrency(
                                            typeof viewingAccount.currentBalance === 'string'
                                                ? parseFloat(viewingAccount.currentBalance) || 0
                                                : viewingAccount.currentBalance || 0
                                        )}
                                    </div>
                                </div>
                                {viewingAccount.parentId && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Parent Account</div>
                                        <div style={{ fontWeight: '500' }}>
                                            {(() => {
                                                const parent = chartAccounts.find(acc => acc.id === viewingAccount.parentId);
                                                return parent ? `${parent.accountCode} - ${parent.accountName}` : 'Unknown';
                                            })()}
                                        </div>
                                    </div>
                                )}
                                {viewingAccount.description && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Description</div>
                                        <div style={{ fontWeight: '500' }}>{viewingAccount.description}</div>
                                    </div>
                                )}
                            </div>
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

export default ChartOfAccountsManager;