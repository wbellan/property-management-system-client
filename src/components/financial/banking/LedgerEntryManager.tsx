import React, { useState, useEffect } from 'react';
import {
    Plus,
    Building2,
    FileText,
    Eye,
    Trash2,
    X,
    Save,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Loader2,
    Search,
    TrendingUp,
    TrendingDown,
    Calculator,
    Receipt
} from 'lucide-react';
import {
    bankingService,
    type LedgerEntry,
    type CreateLedgerEntryData,
    type ChartAccount
} from '../../../services/api/bankingService';
import { apiService } from '../../../services/api/apiService';

interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
}

interface LedgerEntryLine {
    id: string;
    chartAccountId: string;
    entryType: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
}

interface LedgerEntryFormData {
    transactionDate: string;
    description: string;
    referenceNumber: string;
    notes: string;
    entries: LedgerEntryLine[];
}

const LedgerEntryManager: React.FC = () => {
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
    const [chartAccounts, setChartAccounts] = useState<ChartAccount[]>([]);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingEntry, setViewingEntry] = useState<LedgerEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDateRange, setFilterDateRange] = useState('ALL');
    const [formData, setFormData] = useState<LedgerEntryFormData>({
        transactionDate: new Date().toISOString().split('T')[0],
        description: '',
        referenceNumber: '',
        notes: '',
        entries: [
            { id: '1', chartAccountId: '', entryType: 'DEBIT', amount: 0, description: '' },
            { id: '2', chartAccountId: '', entryType: 'CREDIT', amount: 0, description: '' }
        ]
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
        if (!selectedEntity) {
            console.log('❌ No entity selected, skipping data load');
            return;
        }

        console.log('📊 Loading data for entity:', selectedEntity);

        try {
            setRefreshing(true);

            // Load data with entity verification
            console.log('🔍 Fetching ledger entries for entity:', selectedEntity);
            const entriesResponse = await bankingService.getLedgerEntries(selectedEntity);
            console.log('Entries response:', entriesResponse);

            // Extract the entries array from the response object
            const entries = entriesResponse?.entries || entriesResponse || [];
            setLedgerEntries(Array.isArray(entries) ? entries : []);
            console.log('Ledger Entries', entries);

            if (entries?.length > 0) {
                console.log('First entry data structure:', {
                    id: entries[0].id,
                    amount: entries[0].amount,
                    debitAmount: entries[0].debitAmount,
                    creditAmount: entries[0].creditAmount,
                    transactionType: entries[0].transactionType,
                    description: entries[0].description
                });
            }

            console.log('🔍 Fetching chart accounts for entity:', selectedEntity);
            const accounts = await bankingService.getChartAccounts(selectedEntity);
            console.log('✅ Received', accounts?.length || 0, 'chart accounts for entity:', selectedEntity);

            console.log('🔍 Fetching bank accounts for entity:', selectedEntity);
            const banks = await bankingService.getBankAccounts(selectedEntity);
            console.log('✅ Received', banks?.length || 0, 'bank accounts for entity:', selectedEntity);

            // Verify data is entity-specific (add this debug check)
            if (entries?.length > 0) {
                const firstEntry = entries[0];
                console.log('🔍 First entry belongs to entity:', firstEntry.entityId || 'undefined');
                if (firstEntry.entityId && firstEntry.entityId !== selectedEntity) {
                    console.error('❌ DATA MIXING DETECTED! Entry belongs to', firstEntry.entityId, 'but selected entity is', selectedEntity);
                    setError('Data mixing detected - entries from wrong entity. Check backend filtering.');
                    return;
                }
            }

            // Set the data
            setLedgerEntries(entries || []);
            setChartAccounts(accounts || []);
            setBankAccounts(banks || []);

            console.log('✅ Data loaded successfully for entity:', selectedEntity);

        } catch (err) {
            console.error('❌ Error loading entity data:', err);
            setError(`Failed to load ledger data: ${err.message}`);
        } finally {
            setRefreshing(false);
        }
    };

    const handleEntityChange = (entityId: string) => {
        console.log('🔄 Changing entity from', selectedEntity, 'to', entityId);

        // Clear all existing data immediately
        setLedgerEntries([]);
        setChartAccounts([]);
        setBankAccounts([]);
        setError(null);
        setSuccess(null);

        // Set the new entity
        setSelectedEntity(entityId);

        console.log('✅ Entity changed, state cleared');
        // setSelectedEntity(entityId);
        // setLedgerEntries([]);
        // setChartAccounts([]);
        // setBankAccounts([]);
        // setError(null);
        // setSuccess(null);
    };

    const handleAddEntry = () => {
        setFormData({
            transactionDate: new Date().toISOString().split('T')[0],
            description: '',
            referenceNumber: '',
            notes: '',
            entries: [
                { id: '1', chartAccountId: '', entryType: 'DEBIT', amount: 0, description: '' },
                { id: '2', chartAccountId: '', entryType: 'CREDIT', amount: 0, description: '' }
            ]
        });
        setShowAddModal(true);
    };

    const handleViewEntry = (entry: LedgerEntry) => {
        console.log('handleViewEntry', entry);
        setViewingEntry(entry);
        setShowViewModal(true);
    };

    const handleAddLine = () => {
        const newLine: LedgerEntryLine = {
            id: Date.now().toString(),
            chartAccountId: '',
            entryType: 'DEBIT',
            amount: 0,
            description: ''
        };
        setFormData(prev => ({
            ...prev,
            entries: [...prev.entries, newLine]
        }));
    };

    const handleRemoveLine = (lineId: string) => {
        if (formData.entries.length > 2) {
            setFormData(prev => ({
                ...prev,
                entries: prev.entries.filter(entry => entry.id !== lineId)
            }));
        }
    };

    const handleLineChange = (lineId: string, field: keyof LedgerEntryLine, value: any) => {
        setFormData(prev => ({
            ...prev,
            entries: prev.entries.map(entry =>
                entry.id === lineId ? { ...entry, [field]: value } : entry
            )
        }));
    };

    const calculateBalance = () => {
        // const totalDebits = formData.entries
        //     .filter(entry => entry.entryType === 'DEBIT')
        //     .reduce((sum, entry) => sum + (entry.amount || 0), 0);
        // const totalCredits = formData.entries
        //     .filter(entry => entry.entryType === 'CREDIT')
        //     .reduce((sum, entry) => sum + (entry.amount || 0), 0);

        const totalDebits = ledgerEntries.reduce((sum, entry) => {
            // Handle the case where amount is the main field
            const amount = entry.amount || 0;
            const debitAmount = entry.debitAmount || 0;

            // Use amount field if transactionType is DEBIT, otherwise use debitAmount
            const finalDebitAmount = entry.transactionType === 'DEBIT'
                ? (typeof amount === 'string' ? parseFloat(amount) : amount)
                : (typeof debitAmount === 'string' ? parseFloat(debitAmount) : debitAmount);

            return sum + (isNaN(finalDebitAmount) ? 0 : finalDebitAmount);
        }, 0);

        const totalCredits = ledgerEntries.reduce((sum, entry) => {
            // Handle the case where amount is the main field
            const amount = entry.amount || 0;
            const creditAmount = entry.creditAmount || 0;

            // Use amount field if transactionType is CREDIT, otherwise use creditAmount
            const finalCreditAmount = entry.transactionType === 'CREDIT'
                ? (typeof amount === 'string' ? parseFloat(amount) : amount)
                : (typeof creditAmount === 'string' ? parseFloat(creditAmount) : creditAmount);

            return sum + (isNaN(finalCreditAmount) ? 0 : finalCreditAmount);
        }, 0);

        return {
            totalDebits,
            totalCredits,
            difference: totalDebits - totalCredits,
            isBalanced: Math.abs(totalDebits - totalCredits) < 0.01
        };
    };

    const handleSaveEntry = async () => {
        if (!selectedEntity) return;

        const balance = calculateBalance();
        if (!balance.isBalanced) {
            setError('Entry is not balanced! Debits must equal credits.');
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required.');
            return;
        }

        if (formData.entries.some(entry => !entry.chartAccountId || entry.amount <= 0)) {
            setError('All entry lines must have an account selected and an amount greater than 0.');
            return;
        }

        if (!bankAccounts.length) {
            setError('No bank accounts available. Please set up a bank account first.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const entryData: CreateLedgerEntryData = {
                transactionDate: formData.transactionDate,
                description: formData.description,
                referenceNumber: formData.referenceNumber || undefined,
                notes: formData.notes || undefined,
                entries: formData.entries.map(entry => ({
                    chartAccountId: entry.chartAccountId,
                    entryType: entry.entryType,
                    amount: entry.amount,
                    description: entry.description
                }))
            };

            const newEntries = await bankingService.createLedgerEntry(
                selectedEntity,
                entryData,
                bankAccounts[0].id
            );

            setLedgerEntries(prev => [...newEntries, ...prev]);
            setSuccess('Ledger entry created successfully!');
            setShowAddModal(false);
        } catch (err) {
            setError(`Failed to save ledger entry: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteEntry = async (entry: LedgerEntry) => {
        console.log('Attempting to delete entry:', entry.id, 'for entity:', selectedEntity);

        const confirmMessage = `Are you sure you want to delete this ledger entry?

Entry: ${entry.description}
Date: ${new Date(entry.transactionDate).toLocaleDateString()}
Amount: ${formatCurrency(
            entry.transactionType === 'DEBIT'
                ? (typeof entry.debitAmount === 'string' ? parseFloat(entry.debitAmount) : entry.debitAmount) || 0
                : (typeof entry.creditAmount === 'string' ? parseFloat(entry.creditAmount) : entry.creditAmount) || 0
        )}

This action cannot be undone.`;

        if (window.confirm(confirmMessage)) {
            try {
                setSubmitting(true);
                setError(null);

                console.log('Calling delete API for entry:', entry.id);
                await bankingService.deleteLedgerEntry(selectedEntity, entry.id);

                setLedgerEntries(prev => {
                    const updated = prev.filter(e => e.id !== entry.id);
                    console.log('Updated ledger entries count:', updated.length);
                    return updated;
                });

                setSuccess(`Ledger entry deleted successfully: ${entry.description}`);
            } catch (err) {
                console.error('Delete error:', err);
                setError(`Failed to delete ledger entry: ${err.message}`);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleClearAllEntries = async () => {
        if (!selectedEntity || ledgerEntries.length === 0) return;

        const confirmMessage = `DELETE ALL ENTRIES FOR THIS ENTITY

This will delete ALL ${ledgerEntries.length} ledger entries for this entity.

Entity: ${entities.find(e => e.id === selectedEntity)?.name || 'Unknown'}
Entries to delete: ${ledgerEntries.length}

This action CANNOT be undone!

Type "DELETE ALL" to confirm:`;

        const userConfirm = prompt(confirmMessage);
        if (userConfirm === "DELETE ALL") {
            try {
                setSubmitting(true);
                setError(null);

                console.log(`Deleting all ${ledgerEntries.length} entries for entity:`, selectedEntity);

                for (let i = 0; i < ledgerEntries.length; i++) {
                    const entry = ledgerEntries[i];
                    console.log(`Deleting entry ${i + 1}/${ledgerEntries.length}:`, entry.id);
                    await bankingService.deleteLedgerEntry(selectedEntity, entry.id);
                }

                setLedgerEntries([]);
                setSuccess(`Successfully deleted all ${ledgerEntries.length} ledger entries!`);
            } catch (err) {
                console.error('Bulk delete error:', err);
                setError(`Failed to delete all entries: ${err.message}`);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getAccountName = (accountId: string) => {
        const account = chartAccounts.find(acc => acc.id === accountId);
        return account ? `${account.accountCode} - ${account.accountName}` : 'Unknown Account';
    };

    const filteredEntries = ledgerEntries.filter(entry => {
        if (searchTerm && !entry.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(entry.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (filterDateRange !== 'ALL') {
            const entryDate = new Date(entry.transactionDate);
            const now = new Date();
            const daysAgo = { '7D': 7, '30D': 30, '90D': 90 }[filterDateRange] || 30;
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            if (entryDate < cutoffDate) return false;
        }
        return true;
    });

    const totalEntries = ledgerEntries.length;
    const totalDebits = ledgerEntries.reduce((sum, entry) => {
        const debitAmount = typeof entry.debitAmount === 'string'
            ? parseFloat(entry.debitAmount)
            : entry.debitAmount || 0;
        return sum + (isNaN(debitAmount) ? 0 : debitAmount);
    }, 0);
    const totalCredits = ledgerEntries.reduce((sum, entry) => {
        const creditAmount = typeof entry.creditAmount === 'string'
            ? parseFloat(entry.creditAmount)
            : entry.creditAmount || 0;
        return sum + (isNaN(creditAmount) ? 0 : creditAmount);
    }, 0);

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
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading Ledger Entries...</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Fetching transaction history and account data</div>
            </div>
        );
    }

    const balance = calculateBalance();

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

            <div className="properties-header">
                <div>
                    <h1 className="properties-title">Ledger Entries</h1>
                    <p className="properties-subtitle">Manage double-entry bookkeeping transactions and journal entries</p>
                </div>
                <div className="properties-actions">
                    <button className="btn btn-secondary" onClick={() => loadEntityData()} disabled={refreshing || !selectedEntity} style={{ opacity: (refreshing || !selectedEntity) ? 0.5 : 1 }}>
                        <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                        Refresh
                    </button>
                    {ledgerEntries.length > 0 && (
                        <button className="btn" onClick={handleClearAllEntries} disabled={submitting || !selectedEntity} style={{ backgroundColor: '#dc2626', color: 'white', opacity: (submitting || !selectedEntity) ? 0.5 : 1 }}>
                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            Clear All ({ledgerEntries.length})
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={handleAddEntry} disabled={!selectedEntity || chartAccounts.length === 0} style={{ opacity: (!selectedEntity || chartAccounts.length === 0) ? 0.5 : 1 }}>
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Create Entry
                    </button>
                </div>
            </div>

            <div className="properties-toolbar">
                <div className="search-container">
                    <Building2 className="search-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
                    <select className="search-input" value={selectedEntity} onChange={(e) => handleEntityChange(e.target.value)} style={{ paddingLeft: '3rem' }} disabled={entities.length === 0}>
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
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{ledgerEntries.length} entries</span>
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <FileText style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{totalEntries}</div>
                    <div className="stat-label">Total Entries</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <TrendingUp style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{formatCurrency(totalDebits)}</div>
                    <div className="stat-label">Total Debits</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <TrendingDown style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value">{formatCurrency(totalCredits)}</div>
                    <div className="stat-label">Total Credits</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-purple">
                            <Calculator style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: Math.abs(totalDebits - totalCredits) < 0.01 ? '#059669' : '#dc2626' }}>
                        {Math.abs(totalDebits - totalCredits) < 0.01 ? '✓ Balanced' : 'Unbalanced'}
                    </div>
                    <div className="stat-label">Ledger Status</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div className="search-container" style={{ flex: 1, minWidth: '300px' }}>
                    <Search className="search-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
                    <input type="text" className="search-input" placeholder="Search by description or reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '3rem' }} />
                </div>
                <select className="form-input" value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)} style={{ minWidth: '150px' }}>
                    <option value="ALL">All Time</option>
                    <option value="7D">Last 7 Days</option>
                    <option value="30D">Last 30 Days</option>
                    <option value="90D">Last 90 Days</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredEntries.map(entry => (
                    <div key={entry.id} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
                                <div className="stat-icon stat-icon-blue" style={{ width: '3rem', height: '3rem', flexShrink: 0 }}>
                                    <Receipt style={{ width: '1.5rem', height: '1.5rem' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.25rem', margin: 0 }}>{entry.description}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-500)', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                        <span>{new Date(entry.transactionDate).toLocaleDateString()}</span>
                                        {entry.referenceNumber && (
                                            <>
                                                <span>•</span>
                                                <span>Ref: {entry.referenceNumber}</span>
                                            </>
                                        )}
                                        <span>•</span>
                                        <span>{entry.chartAccount ? `${entry.chartAccount.accountCode} - ${entry.chartAccount.accountName}` : 'Unknown Account'}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                        {/* {formatCurrency(
                                            typeof entry.debitAmount === 'string'
                                                ? parseFloat(entry.debitAmount) || 0
                                                : entry.debitAmount || 0
                                        )} */}
                                        {formatCurrency(
                                            typeof entry.amount === 'string'
                                                ? parseFloat(entry.amount) || 0
                                                : entry.amount || 0
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                        {entry.transactionType === 'DEBIT' ? 'Debit' : 'Credit'} Amount
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="maintenance-action-btn" onClick={() => handleViewEntry(entry)} title="View Details" disabled={submitting}>
                                        <Eye style={{ width: '1rem', height: '1rem' }} />
                                    </button>
                                    <button className="maintenance-action-btn" onClick={() => handleDeleteEntry(entry)} title="Delete Entry" style={{ color: '#dc2626' }} disabled={submitting}>
                                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEntries.length === 0 && selectedEntity && chartAccounts.length > 0 && !refreshing && (
                    <div className="page-placeholder">
                        <FileText style={{ width: '3rem', height: '3rem', marginBottom: '1rem', color: 'var(--gray-400)' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Ledger Entries Found</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Create your first journal entry to start tracking transactions.</p>
                        <button className="btn btn-primary" onClick={handleAddEntry}>
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            Create First Entry
                        </button>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '50rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>Create Ledger Entry</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--gray-500)' }} disabled={submitting}>
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="form-label">Transaction Date *</label>
                                <input type="date" className="form-input" value={formData.transactionDate} onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))} required disabled={submitting} />
                            </div>
                            <div>
                                <label className="form-label">Reference Number</label>
                                <input type="text" className="form-input" value={formData.referenceNumber} onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))} placeholder="Optional reference" disabled={submitting} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Description *</label>
                            <input type="text" className="form-input" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Enter transaction description" required disabled={submitting} />
                        </div>

                        <div style={{ padding: '1rem', backgroundColor: balance.isBalanced ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${balance.isBalanced ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', color: balance.isBalanced ? '#059669' : '#dc2626' }}>
                                    {balance.isBalanced ? '✓ Entry is balanced' : '⚠ Entry is not balanced'}
                                </span>
                                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
                                    <span>Debits: {formatCurrency(balance.totalDebits)}</span>
                                    <span>Credits: {formatCurrency(balance.totalCredits)}</span>
                                    {!balance.isBalanced && (
                                        <span style={{ color: '#dc2626', fontWeight: '600' }}>Difference: {formatCurrency(Math.abs(balance.difference))}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>Journal Entry Lines</h3>
                                <button type="button" className="btn btn-secondary" onClick={handleAddLine} disabled={submitting} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                    <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                                    Add Line
                                </button>
                            </div>

                            {formData.entries.map((line) => (
                                <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end', padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--gray-200)' }}>
                                    <div>
                                        <label className="form-label">Account *</label>
                                        <select className="form-input" value={line.chartAccountId} onChange={(e) => handleLineChange(line.id, 'chartAccountId', e.target.value)} required disabled={submitting}>
                                            <option value="">Select Account</option>
                                            {chartAccounts.map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.accountCode} - {account.accountName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Type *</label>
                                        <select className="form-input" value={line.entryType} onChange={(e) => handleLineChange(line.id, 'entryType', e.target.value as 'DEBIT' | 'CREDIT')} required disabled={submitting}>
                                            <option value="DEBIT">Debit</option>
                                            <option value="CREDIT">Credit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Amount *</label>
                                        <input type="number" step="0.01" min="0" className="form-input" value={line.amount || ''} onChange={(e) => handleLineChange(line.id, 'amount', parseFloat(e.target.value) || 0)} placeholder="0.00" required disabled={submitting} />
                                    </div>
                                    <div>
                                        <label className="form-label">Line Description</label>
                                        <input type="text" className="form-input" value={line.description} onChange={(e) => handleLineChange(line.id, 'description', e.target.value)} placeholder="Optional" disabled={submitting} />
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => handleRemoveLine(line.id)} disabled={formData.entries.length <= 2 || submitting} style={{ background: 'none', border: 'none', padding: '0.5rem', borderRadius: '0.25rem', cursor: formData.entries.length > 2 ? 'pointer' : 'not-allowed', color: formData.entries.length > 2 ? '#dc2626' : 'var(--gray-400)', opacity: formData.entries.length > 2 ? 1 : 0.5 }} title="Remove Line">
                                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Notes</label>
                            <textarea className="form-input" rows={3} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Optional notes about this entry" disabled={submitting} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }} disabled={submitting}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveEntry} style={{ flex: 1, opacity: submitting ? 0.7 : 1 }} disabled={submitting || !balance.isBalanced}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save style={{ width: '1rem', height: '1rem' }} />
                                        Create Entry
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && viewingEntry && (
                <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '40rem', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>Ledger Entry Details</h2>
                            <button onClick={() => setShowViewModal(false)} style={{ background: 'none', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--gray-500)' }}>
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Description</div>
                                    <div style={{ fontWeight: '500' }}>{viewingEntry.description}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Transaction Date</div>
                                    <div style={{ fontWeight: '500' }}>{new Date(viewingEntry.transactionDate).toLocaleDateString()}</div>
                                </div>
                                {viewingEntry.referenceNumber && (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Reference Number</div>
                                        <div style={{ fontWeight: '500' }}>{viewingEntry.referenceNumber}</div>
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Account</div>
                                    <div style={{ fontWeight: '500' }}>
                                        {viewingEntry.chartAccount
                                            ? `${viewingEntry.chartAccount.accountCode} - ${viewingEntry.chartAccount.accountName}`
                                            : 'Unknown Account'
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Type</div>
                                    <div style={{ fontWeight: '500', color: viewingEntry.transactionType === 'DEBIT' ? '#2563eb' : '#16a34a' }}>
                                        {viewingEntry.transactionType}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Amount</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--gray-900)' }}>
                                        {formatCurrency(
                                            viewingEntry.transactionType === 'DEBIT'
                                                ? (typeof viewingEntry.debitAmount === 'string' ? parseFloat(viewingEntry.debitAmount) : viewingEntry.debitAmount) || 0
                                                : (typeof viewingEntry.creditAmount === 'string' ? parseFloat(viewingEntry.creditAmount) : viewingEntry.creditAmount) || 0
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Created</div>
                                    <div style={{ fontWeight: '500' }}>{new Date(viewingEntry.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => setShowViewModal(false)} style={{ flex: 1 }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LedgerEntryManager;