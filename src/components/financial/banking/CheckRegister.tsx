// src/components/financial/banking/CheckRegister.tsx
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Plus,
    Edit3,
    Trash2,
    Building2,
    Calendar,
    DollarSign,
    FileText,
    Check,
    CreditCard,
    Banknote,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    Loader2,
    ChevronUp,
    ChevronDown,
    X,
    Save,
    AlertTriangle,
    Printer,
    Hash
} from 'lucide-react';
import { bankingService, type BankAccount, type ChartAccount } from '../../../services/api/bankingService';
import { apiService } from '../../../services/api/apiService';
import { exportToCSV, exportToExcel, exportToPDF, type TransactionExportData } from '../../../utils/exportUtils';
import NewTransactionModal from './NewTransactionModal';
import EditTransactionModal from './EditTransactionModal';
import DeleteTransactionModal from './DeleteTransactionModal';

interface Entity {
    id: string;
    name: string;
}

interface RegisterTransaction {
    id: string;
    date: string;
    referenceNumber: string;
    transactionType: 'PAYMENT' | 'DEPOSIT' | 'CHECK' | 'TRANSFER' | 'FEE' | 'ADJUSTMENT';
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
    balance: number;
    isReconciled: boolean;
    entityId: string;
    createdAt: string;
}

interface NewTransactionData {
    date: string;
    referenceNumber: string;
    transactionType: 'PAYMENT' | 'DEPOSIT' | 'CHECK' | 'TRANSFER';
    payeeOrPayer: string;
    chartAccountId: string;
    memo: string;
    amount: number;
}

interface EditTransactionData {
    date: string;
    referenceNumber: string;
    payeeOrPayer: string;
    memo: string;
}

const CheckRegister: React.FC = () => {
    // Core state
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [chartAccounts, setChartAccounts] = useState<ChartAccount[]>([]);
    const [transactions, setTransactions] = useState<RegisterTransaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<RegisterTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<RegisterTransaction | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState<RegisterTransaction | null>(null);

    // Form states
    const [newTransactionForm, setNewTransactionForm] = useState<NewTransactionData>({
        date: new Date().toISOString().split('T')[0],
        referenceNumber: '',
        transactionType: 'PAYMENT',
        payeeOrPayer: '',
        chartAccountId: '',
        memo: '',
        amount: 0
    });

    const [editForm, setEditForm] = useState<EditTransactionData>({
        date: '',
        referenceNumber: '',
        payeeOrPayer: '',
        memo: ''
    });

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [reconciledFilter, setReconciledFilter] = useState('all');
    const [sortField, setSortField] = useState<keyof RegisterTransaction>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const entitiesResponse = await apiService.getEntities();
                const entitiesData = entitiesResponse.data || [];
                setEntities(entitiesData);

                if (entitiesData.length > 0) {
                    setSelectedEntityId(entitiesData[0].id);
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
                setError('Failed to load initial data');
            }
        };

        loadInitialData();
    }, []);

    // Load bank accounts and chart accounts when entity changes
    useEffect(() => {
        if (selectedEntityId) {
            loadBankAccounts();
            loadChartAccounts();
        }
    }, [selectedEntityId]);

    // Load transactions when account changes
    useEffect(() => {
        if (selectedAccountId) {
            loadTransactions();
        }
    }, [selectedAccountId]);

    // Apply filters when data or filters change
    useEffect(() => {
        applyFilters();
    }, [transactions, searchTerm, dateFilter, typeFilter, reconciledFilter]);

    const loadBankAccounts = async () => {
        try {
            const accounts = await bankingService.getBankAccounts(selectedEntityId);
            setBankAccounts(accounts);

            if (accounts.length > 0) {
                setSelectedAccountId(accounts[0].id);
            }
        } catch (error) {
            console.error('Error loading bank accounts:', error);
            setError('Failed to load bank accounts');
        }
    };

    const loadChartAccounts = async () => {
        try {
            const accounts = await bankingService.getChartAccounts(selectedEntityId);
            setChartAccounts(accounts);
        } catch (error) {
            console.error('Error loading chart accounts:', error);
            setError('Failed to load chart accounts');
        }
    };

    const loadTransactions = async () => {
        if (!selectedAccountId) return;

        setLoading(true);
        setError(null);

        try {
            console.log('Loading transactions for account:', selectedAccountId, 'entity:', selectedEntityId);

            // Use the new bank transactions API
            const response = await bankingService.getBankTransactions(
                selectedEntityId,
                selectedAccountId,
                {
                    limit: 1000, // Get a large number of transactions
                    offset: 0
                }
            );

            console.log('Bank transactions response:', response);

            // The response should match BankTransactionsResponse interface
            const bankTransactions = response.data || [];

            if (bankTransactions.length === 0) {
                console.log('No bank transactions found');
                setTransactions([]);
                return;
            }

            // Convert bank transactions to check register format
            const registerTransactions: RegisterTransaction[] = bankTransactions.map(transaction => ({
                id: transaction.id,
                date: transaction.date,
                referenceNumber: transaction.referenceNumber || '',
                transactionType: transaction.transactionType === 'DEBIT' ? 'DEPOSIT' : 'PAYMENT',
                payeeOrPayer: transaction.description,
                chartAccount: {
                    id: '', // Bank transactions don't have chart accounts directly
                    accountCode: '',
                    accountName: 'Bank Transaction',
                    accountType: 'ASSET'
                },
                memo: transaction.description,
                payment: transaction.transactionType === 'CREDIT' ? transaction.amount : 0,
                deposit: transaction.transactionType === 'DEBIT' ? transaction.amount : 0,
                balance: transaction.runningBalance || 0,
                isReconciled: false, // Add reconciliation logic later
                entityId: selectedEntityId,
                createdAt: transaction.createdAt
            }));

            // Sort by date (newest first)
            const sortedTransactions = registerTransactions.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            console.log('Final processed transactions:', sortedTransactions);
            setTransactions(sortedTransactions);

        } catch (error) {
            console.error('Error loading bank transactions:', error);
            setError('Failed to load bank transactions: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...transactions];

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.payeeOrPayer.toLowerCase().includes(search) ||
                t.memo.toLowerCase().includes(search) ||
                t.referenceNumber.toLowerCase().includes(search) ||
                t.chartAccount.accountName.toLowerCase().includes(search)
            );
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case '7d':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case '30d':
                    filterDate.setDate(now.getDate() - 30);
                    break;
                case '90d':
                    filterDate.setDate(now.getDate() - 90);
                    break;
                case '1y':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            filtered = filtered.filter(t => new Date(t.date) >= filterDate);
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.transactionType === typeFilter);
        }

        // Reconciled filter
        if (reconciledFilter !== 'all') {
            const isReconciled = reconciledFilter === 'reconciled';
            filtered = filtered.filter(t => t.isReconciled === isReconciled);
        }

        // Sort
        filtered.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            const direction = sortDirection === 'asc' ? 1 : -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue) * direction;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * direction;
            }

            return 0;
        });

        setFilteredTransactions(filtered);
    };

    const handleSort = (field: keyof RegisterTransaction) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof RegisterTransaction) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    // Format currency with commas
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Get transaction type icon with color
    const getTransactionTypeIcon = (type: string) => {
        switch (type) {
            case 'PAYMENT': return <ArrowDownCircle size={14} className="text-red-600" />;
            case 'DEPOSIT': return <ArrowUpCircle size={14} className="text-green-600" />;
            case 'CHECK': return <Check size={14} className="text-blue-600" />;
            case 'TRANSFER': return <RefreshCw size={14} className="text-purple-600" />;
            case 'FEE': return <DollarSign size={14} className="text-gray-600" />;
            default: return <FileText size={14} className="text-gray-600" />;
        }
    };

    // Export handler functions
    const handleExportCSV = async () => {
        try {
            if (filteredTransactions.length === 0) {
                alert('No transactions to export');
                return;
            }

            // Convert transactions to export format
            const exportData: TransactionExportData[] = filteredTransactions.map(t => ({
                id: t.id,
                date: t.date,
                referenceNumber: t.referenceNumber,
                transactionType: t.transactionType,
                payeeOrPayer: t.payeeOrPayer,
                chartAccount: t.chartAccount,
                memo: t.memo,
                payment: t.payment,
                deposit: t.deposit,
                balance: t.balance
            }));

            const selectedEntity = entities.find(e => e.id === selectedEntityId);

            const filename = exportToCSV(exportData, {
                bankAccountName: selectedAccount?.accountName,
                entityName: selectedEntity?.name,
            });

            // Show success message
            alert(`Successfully exported ${filteredTransactions.length} transactions to ${filename}`);

        } catch (error) {
            console.error('CSV Export Error:', error);
            alert('Failed to export CSV. Please try again.');
        }
    };

    const handleExportExcel = async () => {
        try {
            if (filteredTransactions.length === 0) {
                alert('No transactions to export');
                return;
            }

            // Convert transactions to export format
            const exportData: TransactionExportData[] = filteredTransactions.map(t => ({
                id: t.id,
                date: t.date,
                referenceNumber: t.referenceNumber,
                transactionType: t.transactionType,
                payeeOrPayer: t.payeeOrPayer,
                chartAccount: t.chartAccount,
                memo: t.memo,
                payment: t.payment,
                deposit: t.deposit,
                balance: t.balance
            }));

            const selectedEntity = entities.find(e => e.id === selectedEntityId);

            const filename = exportToExcel(exportData, {
                bankAccountName: selectedAccount?.accountName,
                entityName: selectedEntity?.name,
            });

            alert(`Successfully exported ${filteredTransactions.length} transactions to ${filename}`);

        } catch (error) {
            console.error('Excel Export Error:', error);
            alert('Failed to export Excel file. Please try again.');
        }
    };

    const handlePrintPDF = async () => {
        try {
            if (filteredTransactions.length === 0) {
                alert('No transactions to print');
                return;
            }

            // Show loading state
            const printButton = document.querySelector('[data-action="print"]') as HTMLButtonElement;
            if (printButton) {
                printButton.disabled = true;
                printButton.innerHTML = '<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="32"><animate attributeName="stroke-dashoffset" dur="1s" values="32;0" repeatCount="indefinite" /></circle></svg> Generating...';
            }

            const selectedEntity = entities.find(e => e.id === selectedEntityId);

            const filename = await exportToPDF('check-register-table', {
                bankAccountName: selectedAccount?.accountName,
                entityName: selectedEntity?.name,
            });

            alert(`Successfully generated PDF: ${filename}`);

        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            // Restore button state
            const printButton = document.querySelector('[data-action="print"]') as HTMLButtonElement;
            if (printButton) {
                printButton.disabled = false;
                printButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print';
            }
        }
    };

    const handleTransactionCreated = () => {
        // Reload transactions to show the new one
        loadTransactions();
    }

    const handleEditTransaction = (transaction: RegisterTransaction) => {
        setEditingTransaction(transaction);
        setShowEditModal(true);
    };

    // Add this handler for when transaction is updated
    const handleTransactionUpdated = () => {
        // Reload transactions to show the updated data
        loadTransactions();
        setShowEditModal(false);
        setEditingTransaction(null);
    };

    // Add this handler function
    const handleDeleteTransaction = (transaction: RegisterTransaction) => {
        setDeletingTransaction(transaction);
        setShowDeleteModal(true);
    };

    // Add this callback for when deletion is complete
    const handleTransactionDeleted = () => {
        // Reload transactions
        loadTransactions();
        setShowDeleteModal(false);
        setDeletingTransaction(null);
    };

    // const handleUpdateTransaction = async () => {
    //     if (!editingTransaction) return;

    //     try {
    //         setLoading(true);
    //         setError(null);

    //         // Validate edit form
    //         if (!editForm.payeeOrPayer.trim()) {
    //             throw new Error('Description is required');
    //         }

    //         const updateData = {
    //             description: editForm.payeeOrPayer.trim(),
    //             referenceNumber: editForm.referenceNumber || undefined
    //         };

    //         await bankingService.updateBankTransaction(
    //             selectedEntityId,
    //             selectedAccountId,
    //             editingTransaction.id,
    //             updateData
    //         );

    //         // Close modal and refresh data
    //         setShowEditModal(false);
    //         setEditingTransaction(null);
    //         await loadTransactions();

    //         alert('Transaction updated successfully');

    //     } catch (error) {
    //         console.error('Error updating transaction:', error);
    //         setError('Failed to update transaction: ' + (error as Error).message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const selectedAccount = bankAccounts.find(a => a.id === selectedAccountId);
    const totalPayments = filteredTransactions.reduce((sum, t) => sum + t.payment, 0);
    const totalDeposits = filteredTransactions.reduce((sum, t) => sum + t.deposit, 0);

    return (
        <div className="main-content">
            <div className="properties-container">
                {/* Header */}
                <div className="properties-header">
                    <div>
                        <h1 className="properties-title">Check Register</h1>
                        <p className="properties-subtitle">Bank account transaction register</p>
                    </div>

                    <div className="properties-actions">
                        <button
                            onClick={() => setShowNewTransactionModal(true)}
                            className="btn btn-primary"
                            disabled={!selectedAccountId}
                        >
                            <Plus size={16} />
                            <span>New Transaction</span>
                        </button>
                        <div className="properties-actions">
                            <button
                                onClick={handleExportCSV}
                                className="btn btn-secondary"
                                disabled={filteredTransactions.length === 0}
                                title="Export to CSV"
                            >
                                <Download size={16} />
                                <span>CSV</span>
                            </button>

                            <button
                                onClick={handleExportExcel}
                                className="btn btn-secondary"
                                disabled={filteredTransactions.length === 0}
                                title="Export to Excel"
                            >
                                <Download size={16} />
                                <span>Excel</span>
                            </button>

                            <button
                                onClick={handlePrintPDF}
                                className="btn btn-secondary"
                                disabled={filteredTransactions.length === 0}
                                data-action="print"
                                title="Print to PDF"
                            >
                                <Printer size={16} />
                                <span>Print</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Selection Card */}
                <div className="property-card">
                    <div className="property-details">
                        <div className="property-detail">
                            <label className="property-detail-label">
                                <Building2 size={16} style={{ marginRight: '0.5rem' }} />
                                Entity
                            </label>
                            <select
                                value={selectedEntityId}
                                onChange={(e) => setSelectedEntityId(e.target.value)}
                                className="search-input"
                                style={{ paddingLeft: '1rem' }}
                            >
                                {entities.map(entity => (
                                    <option key={entity.id} value={entity.id}>
                                        {entity.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="property-detail">
                            <label className="property-detail-label">
                                <CreditCard size={16} style={{ marginRight: '0.5rem' }} />
                                Bank Account
                            </label>
                            <select
                                value={selectedAccountId}
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                className="search-input"
                                style={{ paddingLeft: '1rem' }}
                            >
                                {bankAccounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.accountName} - {account.bankName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Account Summary with Fixed Currency Formatting */}
                    {selectedAccount && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon stat-icon-green">
                                        <DollarSign size={16} color="white" />
                                    </div>
                                </div>
                                <div className="stat-value">{selectedAccount ? formatCurrency(selectedAccount.currentBalance) : '$0.00'}</div>
                                <div className="stat-label">Current Balance</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon stat-icon-blue">
                                        <FileText size={16} color="white" />
                                    </div>
                                </div>
                                <div className="stat-value">{filteredTransactions.length.toLocaleString()}</div>
                                <div className="stat-label">Total Transactions</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon stat-icon-orange">
                                        <ArrowDownCircle size={16} color="white" />
                                    </div>
                                </div>
                                <div className="stat-value">{formatCurrency(totalPayments)}</div>
                                <div className="stat-label">Total Payments</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon stat-icon-green">
                                        <ArrowUpCircle size={16} color="white" />
                                    </div>
                                </div>
                                <div className="stat-value">{formatCurrency(totalDeposits)}</div>
                                <div className="stat-label">Total Deposits</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters Card */}
                <div className="properties-toolbar">
                    <div className="search-container">
                        <Search className="search-icon" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search transactions..."
                            className="search-input"
                        />
                    </div>

                    <div className="filter-controls">
                        <div className="filter-group">
                            <label className="filter-label">
                                <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                                Date Range
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Dates</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">
                                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                                Type
                            </label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Types</option>
                                <option value="PAYMENT">Payments</option>
                                <option value="DEPOSIT">Deposits</option>
                                <option value="CHECK">Checks</option>
                                <option value="TRANSFER">Transfers</option>
                                <option value="FEE">Fees</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">
                                <Check size={16} style={{ marginRight: '0.5rem' }} />
                                Status
                            </label>
                            <select
                                value={reconciledFilter}
                                onChange={(e) => setReconciledFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Status</option>
                                <option value="reconciled">Reconciled</option>
                                <option value="unreconciled">Unreconciled</option>
                            </select>
                        </div>

                        <button
                            onClick={loadTransactions}
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-message">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                style={{
                                    marginLeft: 'auto',
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Transactions Table - Added ID for PDF export */}
                <div className="property-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div className="properties-loading">
                            <Loader2 size={32} className="animate-spin" />
                            <span>Loading transactions...</span>
                        </div>
                    ) : (
                        <div id="check-register-table" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                {/* Your existing table content stays exactly the same */}
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
                                        <th
                                            style={{
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                minWidth: '100px'
                                            }}
                                            onClick={() => handleSort('date')}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <span>Date / Ref</span>
                                                {getSortIcon('date')}
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.8125rem'
                                            }}
                                            onClick={() => handleSort('payeeOrPayer')}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <span>Description / Account</span>
                                                {getSortIcon('payeeOrPayer')}
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'right',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                minWidth: '90px'
                                            }}
                                            onClick={() => handleSort('payment')}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                                <span>Amount</span>
                                                {getSortIcon('payment')}
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'right',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                minWidth: '100px'
                                            }}
                                            onClick={() => handleSort('balance')}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                                <span>Balance</span>
                                                {getSortIcon('balance')}
                                            </div>
                                        </th>
                                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', width: '60px' }}>
                                            Status
                                        </th>
                                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8125rem', width: '80px' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr key={transaction.id} style={{
                                            backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                                            borderBottom: '1px solid #e5e7eb',
                                            fontSize: '0.8125rem'
                                        }}>
                                            {/* Date / Reference Column */}
                                            <td style={{ padding: '0.75rem 0.5rem', verticalAlign: 'top', minWidth: '100px' }}>
                                                <div style={{ lineHeight: 1.3 }}>
                                                    <div style={{ fontWeight: 500, color: '#111827', fontSize: '0.8125rem' }}>
                                                        {new Date(transaction.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        color: '#6b7280',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        marginTop: '0.125rem'
                                                    }}>
                                                        {getTransactionTypeIcon(transaction.transactionType)}
                                                        <span>{transaction.referenceNumber || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Description / Account Column */}
                                            <td style={{ padding: '0.75rem 0.5rem', verticalAlign: 'top' }}>
                                                <div style={{ lineHeight: 1.3, maxWidth: '240px' }}>
                                                    <div style={{
                                                        fontWeight: 500,
                                                        color: '#111827',
                                                        fontSize: '0.8125rem',
                                                        marginBottom: '0.125rem'
                                                    }}>
                                                        {transaction.payeeOrPayer.length > 30 ?
                                                            transaction.payeeOrPayer.substring(0, 30) + '...' :
                                                            transaction.payeeOrPayer
                                                        }
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        color: '#6b7280',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {transaction.chartAccount.accountCode} - {
                                                            transaction.chartAccount.accountName.length > 20 ?
                                                                transaction.chartAccount.accountName.substring(0, 20) + '...' :
                                                                transaction.chartAccount.accountName
                                                        }
                                                    </div>
                                                    {transaction.memo && (
                                                        <div style={{
                                                            fontSize: '0.7rem',
                                                            color: '#9ca3af',
                                                            fontStyle: 'italic',
                                                            marginTop: '0.125rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {transaction.memo.length > 25 ?
                                                                transaction.memo.substring(0, 25) + '...' :
                                                                transaction.memo
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Amount Column */}
                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', verticalAlign: 'top', minWidth: '90px' }}>
                                                {transaction.payment > 0 ? (
                                                    <div style={{
                                                        fontWeight: 600,
                                                        color: '#dc2626',
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        -{formatCurrency(transaction.payment)}
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        fontWeight: 600,
                                                        color: '#059669',
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        +{formatCurrency(transaction.deposit)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Balance Column */}
                                            <td style={{
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'right',
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                verticalAlign: 'top',
                                                minWidth: '100px',
                                                color: '#111827'
                                            }}>
                                                {formatCurrency(transaction.balance)}
                                            </td>

                                            {/* Status Column */}
                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', verticalAlign: 'top' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {transaction.isReconciled ? (
                                                        <span style={{ color: '#059669', fontWeight: 500 }}>✓</span>
                                                    ) : (
                                                        <span style={{ color: '#6b7280' }}>◦</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                                    <button
                                                        onClick={() => handleEditTransaction(transaction)}
                                                        className="property-action-btn"
                                                        title="Edit Transaction"
                                                        style={{ padding: '0.25rem' }}
                                                    >
                                                        <Edit3 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTransaction(transaction)}
                                                        className="property-action-btn"
                                                        title="Delete Transaction"
                                                        style={{ padding: '0.25rem' }}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredTransactions.length === 0 && (
                                <div className="properties-empty">
                                    <FileText size={48} className="empty-icon" />
                                    <h3 className="empty-title">No Transactions Found</h3>
                                    <p className="empty-subtitle">
                                        No transactions match your current filters, or no transactions have been recorded for this account.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals - MOVED TO ROOT LEVEL */}
            <NewTransactionModal
                isOpen={showNewTransactionModal}
                onClose={() => setShowNewTransactionModal(false)}
                selectedEntityId={selectedEntityId}
                selectedAccountId={selectedAccountId}
                bankAccounts={bankAccounts}
                chartAccounts={chartAccounts}
                onTransactionCreated={handleTransactionCreated}
            />
            <EditTransactionModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingTransaction(null);
                }}
                transaction={editingTransaction}
                onTransactionUpdated={handleTransactionUpdated}
                selectedEntityId={selectedEntityId}
                selectedAccountId={selectedAccountId}
            />
            <DeleteTransactionModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletingTransaction(null);
                }}
                transaction={deletingTransaction}
                onTransactionDeleted={handleTransactionDeleted}
                selectedEntityId={selectedEntityId}
                selectedAccountId={selectedAccountId}
            />
        </div>
    );
};

export default CheckRegister;