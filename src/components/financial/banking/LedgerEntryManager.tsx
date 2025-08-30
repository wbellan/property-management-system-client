import React, { useState, useEffect } from 'react';
import {
    Plus,
    Building2,
    Calculator,
    Eye,
    Edit,
    Trash2,
    X,
    Save,
    Search,
    Filter,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Hash,
    CheckCircle,
    AlertTriangle,
    RotateCcw,
    FileText
} from 'lucide-react';

// Types based on your schema
interface LedgerEntry {
    id: string;
    bankLedgerId: string;
    chartAccountId: string;
    transactionType: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
    transactionDate: string;
    referenceNumber?: string;
    referenceId?: string;
    createdAt: string;
    bankLedger: {
        id: string;
        accountName: string;
    };
    chartAccount: {
        id: string;
        accountCode: string;
        accountName: string;
        accountType: string;
    };
}

interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
}

interface BankAccount {
    id: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    currentBalance: number;
}

interface ChartAccount {
    id: string;
    accountCode: string;
    accountName: string;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
}

interface DoubleEntryLine {
    id: string;
    accountId: string;
    accountType: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
}

const LedgerEntryManager: React.FC = () => {
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [chartAccounts, setChartAccounts] = useState<ChartAccount[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
    const [filterDateRange, setFilterDateRange] = useState<'ALL' | '7D' | '30D' | '90D'>('30D');

    // Double-entry form state
    const [entryLines, setEntryLines] = useState<DoubleEntryLine[]>([
        { id: '1', accountId: '', accountType: 'DEBIT', amount: 0, description: '' },
        { id: '2', accountId: '', accountType: 'CREDIT', amount: 0, description: '' }
    ]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<string>('');
    const [entryDescription, setEntryDescription] = useState('');
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [referenceNumber, setReferenceNumber] = useState('');

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            setEntities([
                { id: '1', name: 'Sunset Properties LLC', legalName: 'Sunset Properties LLC', entityType: 'LLC' },
                { id: '2', name: 'Downtown Investments', legalName: 'Downtown Investments Inc.', entityType: 'CORPORATION' }
            ]);
            setSelectedEntity('1');

            setBankAccounts([
                { id: '1', accountName: 'Sunset Operating Account', bankName: 'Chase Bank', accountNumber: '****4567', currentBalance: 125000.50 },
                { id: '2', accountName: 'Sunset Savings Account', bankName: 'Bank of America', accountNumber: '****8901', currentBalance: 50000.00 }
            ]);

            setChartAccounts([
                { id: '1', accountCode: '1001', accountName: 'Cash and Cash Equivalents', accountType: 'ASSET' },
                { id: '2', accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'ASSET' },
                { id: '3', accountCode: '2100', accountName: 'Security Deposits Payable', accountType: 'LIABILITY' },
                { id: '4', accountCode: '4100', accountName: 'Rental Income', accountType: 'REVENUE' },
                { id: '5', accountCode: '5100', accountName: 'Maintenance and Repairs', accountType: 'EXPENSE' },
                { id: '6', accountCode: '5200', accountName: 'Utilities', accountType: 'EXPENSE' }
            ]);

            setLedgerEntries([
                {
                    id: '1',
                    bankLedgerId: '1',
                    chartAccountId: '4',
                    transactionType: 'CREDIT',
                    amount: 2500.00,
                    description: 'Monthly rent payment - Unit 101',
                    transactionDate: '2024-01-15T00:00:00Z',
                    referenceNumber: 'CHECK-1001',
                    createdAt: '2024-01-15T10:30:00Z',
                    bankLedger: { id: '1', accountName: 'Sunset Operating Account' },
                    chartAccount: { id: '4', accountCode: '4100', accountName: 'Rental Income', accountType: 'REVENUE' }
                },
                {
                    id: '2',
                    bankLedgerId: '1',
                    chartAccountId: '1',
                    transactionType: 'DEBIT',
                    amount: 2500.00,
                    description: 'Monthly rent payment - Unit 101',
                    transactionDate: '2024-01-15T00:00:00Z',
                    referenceNumber: 'CHECK-1001',
                    createdAt: '2024-01-15T10:30:00Z',
                    bankLedger: { id: '1', accountName: 'Sunset Operating Account' },
                    chartAccount: { id: '1', accountCode: '1001', accountName: 'Cash and Cash Equivalents', accountType: 'ASSET' }
                },
                {
                    id: '3',
                    bankLedgerId: '1',
                    chartAccountId: '5',
                    transactionType: 'DEBIT',
                    amount: 450.00,
                    description: 'Plumbing repair - Unit 205',
                    transactionDate: '2024-01-12T00:00:00Z',
                    referenceNumber: 'CHECK-1002',
                    createdAt: '2024-01-12T14:20:00Z',
                    bankLedger: { id: '1', accountName: 'Sunset Operating Account' },
                    chartAccount: { id: '5', accountCode: '5100', accountName: 'Maintenance and Repairs', accountType: 'EXPENSE' }
                },
                {
                    id: '4',
                    bankLedgerId: '1',
                    chartAccountId: '1',
                    transactionType: 'CREDIT',
                    amount: 450.00,
                    description: 'Plumbing repair - Unit 205',
                    transactionDate: '2024-01-12T00:00:00Z',
                    referenceNumber: 'CHECK-1002',
                    createdAt: '2024-01-12T14:20:00Z',
                    bankLedger: { id: '1', accountName: 'Sunset Operating Account' },
                    chartAccount: { id: '1', accountCode: '1001', accountName: 'Cash and Cash Equivalents', accountType: 'ASSET' }
                }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getTransactionTypeColor = (type: string) => {
        return type === 'DEBIT' ? 'stat-icon-orange' : 'stat-icon-green';
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

    const calculateBalance = () => {
        const totalDebits = entryLines
            .filter(line => line.accountType === 'DEBIT')
            .reduce((sum, line) => sum + (line.amount || 0), 0);

        const totalCredits = entryLines
            .filter(line => line.accountType === 'CREDIT')
            .reduce((sum, line) => sum + (line.amount || 0), 0);

        return { totalDebits, totalCredits, difference: totalDebits - totalCredits };
    };

    const handleEntityChange = (entityId: string) => {
        setSelectedEntity(entityId);
        // In real app, fetch data for this entity
    };

    const handleAddEntryLine = () => {
        const newLine: DoubleEntryLine = {
            id: Date.now().toString(),
            accountId: '',
            accountType: 'DEBIT',
            amount: 0,
            description: ''
        };
        setEntryLines([...entryLines, newLine]);
    };

    const handleRemoveEntryLine = (lineId: string) => {
        if (entryLines.length > 2) {
            setEntryLines(entryLines.filter(line => line.id !== lineId));
        }
    };

    const handleLineChange = (lineId: string, field: keyof DoubleEntryLine, value: any) => {
        setEntryLines(entryLines.map(line =>
            line.id === lineId ? { ...line, [field]: value } : line
        ));
    };

    const handleSaveEntry = () => {
        const balance = calculateBalance();
        if (balance.difference !== 0) {
            alert('Entry is not balanced! Debits must equal credits.');
            return;
        }

        // In real app, make API call
        console.log('Saving ledger entry:', {
            bankAccountId: selectedBankAccount,
            description: entryDescription,
            date: entryDate,
            referenceNumber,
            lines: entryLines
        });

        setShowEntryModal(false);
        resetForm();
    };

    const resetForm = () => {
        setEntryLines([
            { id: '1', accountId: '', accountType: 'DEBIT', amount: 0, description: '' },
            { id: '2', accountId: '', accountType: 'CREDIT', amount: 0, description: '' }
        ]);
        setSelectedBankAccount('');
        setEntryDescription('');
        setEntryDate(new Date().toISOString().split('T')[0]);
        setReferenceNumber('');
    };

    const filteredEntries = ledgerEntries.filter(entry => {
        // Filter by search term
        if (searchTerm && !entry.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !entry.chartAccount.accountName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(entry.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by transaction type
        if (filterType !== 'ALL' && entry.transactionType !== filterType) {
            return false;
        }

        // Filter by date range
        if (filterDateRange !== 'ALL') {
            const entryDate = new Date(entry.transactionDate);
            const now = new Date();
            const daysAgo = {
                '7D': 7,
                '30D': 30,
                '90D': 90
            }[filterDateRange] || 30;

            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            if (entryDate < cutoffDate) {
                return false;
            }
        }

        return true;
    });

    // Group entries by reference number to show paired entries
    const groupedEntries = filteredEntries.reduce((groups, entry) => {
        const key = entry.referenceNumber || entry.id;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(entry);
        return groups;
    }, {} as Record<string, LedgerEntry[]>);

    if (loading) {
        return (
            <div className="properties-loading">
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    Loading Ledger Entries...
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Fetching transaction history and account data
                </div>
            </div>
        );
    }

    const balance = calculateBalance();

    return (
        // <div className="properties-container">
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Header */}
            {/* <div className="properties-header">
                <div>
                    <h1 className="properties-title">Ledger Entries</h1>
                    <p className="properties-subtitle">
                        Manage double-entry bookkeeping transactions and journal entries
                    </p>
                </div>
                <div className="properties-actions">
                    <button className="btn btn-primary" onClick={() => setShowEntryModal(true)}>
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        New Journal Entry
                    </button>
                </div>
            </div> */}
            <div className="properties-header">
                <div>
                    <h1 className="properties-title">Ledger Entries</h1>
                    <p className="properties-subtitle">
                        Manage double-entry bookkeeping transactions and journal entries
                    </p>
                </div>
                <div className="properties-actions">
                    <button className="btn btn-primary" onClick={() => setShowEntryModal(true)}>
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        New Journal Entry
                    </button>
                </div>
            </div>

            {/* Entity Selector & Filters */}
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

                {/* Search and Filters */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-container">
                        <Search className="search-icon" style={{ width: '1rem', height: '1rem' }} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem', minWidth: '200px' }}
                        />
                    </div>

                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="DEBIT">Debits</option>
                        <option value="CREDIT">Credits</option>
                    </select>

                    <select
                        className="filter-select"
                        value={filterDateRange}
                        onChange={(e) => setFilterDateRange(e.target.value as any)}
                    >
                        <option value="ALL">All Time</option>
                        <option value="7D">Last 7 Days</option>
                        <option value="30D">Last 30 Days</option>
                        <option value="90D">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <TrendingUp style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(filteredEntries.filter(e => e.transactionType === 'DEBIT').reduce((sum, e) => sum + e.amount, 0))}
                    </div>
                    <div className="stat-label">Total Debits</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <TrendingDown style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(filteredEntries.filter(e => e.transactionType === 'CREDIT').reduce((sum, e) => sum + e.amount, 0))}
                    </div>
                    <div className="stat-label">Total Credits</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <FileText style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{Object.keys(groupedEntries).length}</div>
                    <div className="stat-label">Journal Entries</div>
                </div>
            </div>

            {/* Entries List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(groupedEntries).map(([refNumber, entries]) => (
                    <div key={refNumber} className="card" style={{ padding: '1.5rem' }}>
                        {/* Entry Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid var(--gray-200)'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', margin: 0 }}>
                                    {entries[0].description}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar style={{ width: '1rem', height: '1rem' }} />
                                        {new Date(entries[0].transactionDate).toLocaleDateString()}
                                    </div>
                                    {entries[0].referenceNumber && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Hash style={{ width: '1rem', height: '1rem' }} />
                                            {entries[0].referenceNumber}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="maintenance-action-btn" title="View Entry">
                                    <Eye style={{ width: '1rem', height: '1rem' }} />
                                </button>
                                <button className="maintenance-action-btn" title="Edit Entry">
                                    <Edit style={{ width: '1rem', height: '1rem' }} />
                                </button>
                                <button
                                    className="maintenance-action-btn"
                                    title="Delete Entry"
                                    style={{ color: '#dc2626' }}
                                >
                                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                </button>
                            </div>
                        </div>

                        {/* Entry Lines */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {entries.map(entry => (
                                <div key={entry.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem',
                                    backgroundColor: entry.transactionType === 'DEBIT' ? 'rgba(251, 113, 133, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${entry.transactionType === 'DEBIT' ? 'rgba(251, 113, 133, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className={`stat-icon ${getAccountTypeColor(entry.chartAccount.accountType)}`} style={{ width: '2rem', height: '2rem' }}>
                                            <DollarSign style={{ width: '1rem', height: '1rem' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--gray-900)' }}>
                                                {entry.chartAccount.accountCode} - {entry.chartAccount.accountName}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                {entry.chartAccount.accountType} • {entry.bankLedger.accountName}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: entry.transactionType === 'DEBIT' ? '#dc2626' : '#059669'
                                        }}>
                                            {entry.transactionType === 'DEBIT' ? 'DR' : 'CR'} {formatCurrency(entry.amount)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                            {entry.transactionType}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(groupedEntries).length === 0 && (
                    <div className="page-placeholder">
                        <Calculator style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Ledger Entries Found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Create your first journal entry to start tracking transactions.</p>
                        <button className="btn btn-primary" onClick={() => setShowEntryModal(true)}>
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            New Journal Entry
                        </button>
                    </div>
                )}
            </div>

            {/* New Entry Modal */}
            {showEntryModal && (
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
                    <div className="card" style={{ width: '100%', maxWidth: '50rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                New Journal Entry
                            </h2>
                            <button
                                onClick={() => {
                                    setShowEntryModal(false);
                                    resetForm();
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

                        {/* Entry Header Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Bank Account *</label>
                                <select
                                    className="form-input"
                                    value={selectedBankAccount}
                                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                                    required
                                >
                                    <option value="">Select Bank Account</option>
                                    {bankAccounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.accountName} ({account.bankName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Entry Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={entryDate}
                                    onChange={(e) => setEntryDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Reference Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    placeholder="Check #, Invoice #, etc."
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Description *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={entryDescription}
                                onChange={(e) => setEntryDescription(e.target.value)}
                                placeholder="Describe this transaction"
                                required
                            />
                        </div>

                        {/* Entry Lines */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)', margin: 0 }}>
                                    Journal Entry Lines
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleAddEntryLine}
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                                    Add Line
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {entryLines.map((line, index) => (
                                    <div key={line.id} style={{
                                        padding: '1rem',
                                        border: '1px solid var(--gray-200)',
                                        borderRadius: '0.5rem',
                                        backgroundColor: 'var(--gray-50)'
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: '1rem', alignItems: 'end' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', paddingTop: '1.5rem' }}>
                                                #{index + 1}
                                            </div>

                                            <div>
                                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Account</label>
                                                <select
                                                    className="form-input"
                                                    value={line.accountId}
                                                    onChange={(e) => handleLineChange(line.id, 'accountId', e.target.value)}
                                                    style={{ fontSize: '0.875rem' }}
                                                    required
                                                >
                                                    <option value="">Select Account</option>
                                                    {chartAccounts.map(account => (
                                                        <option key={account.id} value={account.id}>
                                                            {account.accountCode} - {account.accountName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Type</label>
                                                <select
                                                    className="form-input"
                                                    value={line.accountType}
                                                    onChange={(e) => handleLineChange(line.id, 'accountType', e.target.value)}
                                                    style={{ fontSize: '0.875rem', minWidth: '100px' }}
                                                    required
                                                >
                                                    <option value="DEBIT">Debit</option>
                                                    <option value="CREDIT">Credit</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Amount</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-input"
                                                    value={line.amount || ''}
                                                    onChange={(e) => handleLineChange(line.id, 'amount', parseFloat(e.target.value) || 0)}
                                                    style={{ fontSize: '0.875rem', minWidth: '120px' }}
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                {entryLines.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveEntryLine(line.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#dc2626',
                                                            cursor: 'pointer',
                                                            padding: '0.5rem'
                                                        }}
                                                        title="Remove Line"
                                                    >
                                                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Balance Check */}
                        <div style={{
                            padding: '1rem',
                            backgroundColor: balance.difference === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${balance.difference === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {balance.difference === 0 ?
                                        <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} /> :
                                        <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                                    }
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: balance.difference === 0 ? '#059669' : '#dc2626'
                                    }}>
                                        {balance.difference === 0 ? 'Entry is balanced' : 'Entry is not balanced'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                    Difference: {formatCurrency(Math.abs(balance.difference))}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                                <div>Total Debits: <strong>{formatCurrency(balance.totalDebits)}</strong></div>
                                <div>Total Credits: <strong>{formatCurrency(balance.totalCredits)}</strong></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowEntryModal(false);
                                    resetForm();
                                }}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveEntry}
                                disabled={balance.difference !== 0 || !selectedBankAccount || !entryDescription}
                                style={{
                                    flex: 1,
                                    opacity: (balance.difference !== 0 || !selectedBankAccount || !entryDescription) ? 0.5 : 1
                                }}
                            >
                                <Save style={{ width: '1rem', height: '1rem' }} />
                                Save Journal Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LedgerEntryManager;