import React, { useState, useEffect } from 'react';
import {
    Upload,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    Calendar,
    FileText,
    Download,
    RefreshCw,
    Eye,
    Check,
    X
} from 'lucide-react';
import Papa from 'papaparse';

interface BankTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
    reference?: string;
    balance?: number;
}

interface SystemTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    reference?: string;
    invoiceNumber?: string;
}

interface ReconciliationMatch {
    bankTransaction: BankTransaction;
    systemTransaction?: SystemTransaction;
    status: 'matched' | 'unmatched' | 'potential';
    confidence?: number;
}

const BankReconciliation: React.FC = () => {
    const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
    const [systemTransactions, setSystemTransactions] = useState<SystemTransaction[]>([]);
    const [matches, setMatches] = useState<ReconciliationMatch[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState('current-month');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [reconciliationDate, setReconciliationDate] = useState(new Date().toISOString().split('T')[0]);

    // Mock data - replace with actual API calls
    useEffect(() => {
        loadMockData();
    }, []);

    const loadMockData = () => {
        // Mock bank transactions
        const mockBankTransactions: BankTransaction[] = [
            {
                id: 'bank-1',
                date: '2024-08-28',
                description: 'DEPOSIT - RENT PAYMENT',
                amount: 2500.00,
                type: 'credit',
                reference: 'DEP001',
                balance: 15750.00
            },
            {
                id: 'bank-2',
                date: '2024-08-27',
                description: 'MAINTENANCE - PLUMBING REPAIR',
                amount: -350.00,
                type: 'debit',
                reference: 'CHK1234',
                balance: 13250.00
            },
            {
                id: 'bank-3',
                date: '2024-08-26',
                description: 'DEPOSIT - RENT PAYMENT',
                amount: 1800.00,
                type: 'credit',
                reference: 'DEP002',
                balance: 13600.00
            },
            {
                id: 'bank-4',
                date: '2024-08-25',
                description: 'UNKNOWN DEPOSIT',
                amount: 500.00,
                type: 'credit',
                reference: 'DEP003',
                balance: 11800.00
            }
        ];

        // Mock system transactions
        const mockSystemTransactions: SystemTransaction[] = [
            {
                id: 'sys-1',
                date: '2024-08-28',
                description: 'Rent Payment - Unit 101',
                amount: 2500.00,
                type: 'income',
                category: 'Rent',
                reference: 'INV-2024-001',
                invoiceNumber: 'INV-2024-001'
            },
            {
                id: 'sys-2',
                date: '2024-08-27',
                description: 'Plumbing Repair - Unit 203',
                amount: 350.00,
                type: 'expense',
                category: 'Maintenance',
                reference: 'EXP-2024-045'
            },
            {
                id: 'sys-3',
                date: '2024-08-26',
                description: 'Rent Payment - Unit 205',
                amount: 1800.00,
                type: 'income',
                category: 'Rent',
                reference: 'INV-2024-002',
                invoiceNumber: 'INV-2024-002'
            }
        ];

        setBankTransactions(mockBankTransactions);
        setSystemTransactions(mockSystemTransactions);

        // Auto-match transactions
        const autoMatches = performAutoMatching(mockBankTransactions, mockSystemTransactions);
        setMatches(autoMatches);
    };

    const performAutoMatching = (bankTrans: BankTransaction[], sysTrans: SystemTransaction[]): ReconciliationMatch[] => {
        const matches: ReconciliationMatch[] = [];
        const usedSystemTransactions = new Set<string>();

        bankTrans.forEach(bankTransaction => {
            const potentialMatches = sysTrans.filter(sysTransaction => {
                if (usedSystemTransactions.has(sysTransaction.id)) return false;

                const amountMatch = Math.abs(Math.abs(bankTransaction.amount) - sysTransaction.amount) < 0.01;
                const dateMatch = bankTransaction.date === sysTransaction.date;

                return amountMatch && dateMatch;
            });

            if (potentialMatches.length === 1) {
                usedSystemTransactions.add(potentialMatches[0].id);
                matches.push({
                    bankTransaction,
                    systemTransaction: potentialMatches[0],
                    status: 'matched',
                    confidence: 95
                });
            } else if (potentialMatches.length > 1) {
                matches.push({
                    bankTransaction,
                    systemTransaction: potentialMatches[0],
                    status: 'potential',
                    confidence: 70
                });
            } else {
                matches.push({
                    bankTransaction,
                    status: 'unmatched'
                });
            }
        });

        return matches;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Only process CSV files for security
        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Please upload a CSV file only. Excel files (.xlsx, .xls) are not supported for security reasons.');
            return;
        }

        setIsLoading(true);

        // Use PapaParse to securely parse CSV
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                setIsLoading(false);
                try {
                    // Process the CSV data
                    const bankTransactions = results.data.map((row: any, index: number) => ({
                        id: `import-${index}`,
                        date: row.Date || row.date || row.DATE,
                        amount: parseFloat(row.Amount || row.amount || row.AMOUNT || '0'),
                        description: row.Description || row.description || row.DESCRIPTION || '',
                        reference: row.Reference || row.reference || row.REFERENCE || '',
                        type: row.Type || row.type || row.TYPE || 'DEBIT'
                    })).filter(t => t.amount && t.date); // Filter out invalid rows

                    console.log('Imported bank transactions:', bankTransactions);

                    // Update your state with the imported transactions
                    setBankTransactions(bankTransactions);

                    alert(`Successfully imported ${bankTransactions.length} transactions from ${file.name}`);
                } catch (error) {
                    console.error('Error processing CSV:', error);
                    alert('Error processing the CSV file. Please check the format and try again.');
                }
            },
            error: (error) => {
                setIsLoading(false);
                console.error('CSV parsing error:', error);
                alert('Failed to parse CSV file. Please check the format and try again.');
            }
        });
    };

    const handleManualMatch = (matchIndex: number, systemTransactionId?: string) => {
        const updatedMatches = [...matches];
        const selectedSystemTransaction = systemTransactions.find(t => t.id === systemTransactionId);

        updatedMatches[matchIndex] = {
            ...updatedMatches[matchIndex],
            systemTransaction: selectedSystemTransaction,
            status: selectedSystemTransaction ? 'matched' : 'unmatched',
            confidence: selectedSystemTransaction ? 100 : undefined
        };

        setMatches(updatedMatches);
    };

    const getStatusIcon = (status: ReconciliationMatch['status']) => {
        switch (status) {
            case 'matched':
                return <CheckCircle size={16} style={{ color: '#059669' }} />;
            case 'potential':
                return <AlertCircle size={16} style={{ color: '#d97706' }} />;
            case 'unmatched':
                return <XCircle size={16} style={{ color: '#dc2626' }} />;
        }
    };

    const getStatusBadge = (status: ReconciliationMatch['status']) => {
        const baseStyles = {
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.025em'
        };

        switch (status) {
            case 'matched':
                return (
                    <span style={{ ...baseStyles, background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                        Matched
                    </span>
                );
            case 'potential':
                return (
                    <span style={{ ...baseStyles, background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                        Potential
                    </span>
                );
            case 'unmatched':
                return (
                    <span style={{ ...baseStyles, background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
                        Unmatched
                    </span>
                );
        }
    };

    const filteredMatches = matches.filter(match => {
        const matchesSearch = match.bankTransaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.systemTransaction?.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || match.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const reconciliationStats = {
        total: matches.length,
        matched: matches.filter(m => m.status === 'matched').length,
        unmatched: matches.filter(m => m.status === 'unmatched').length,
        potential: matches.filter(m => m.status === 'potential').length
    };

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {/* Clean Header - consistent with main pages */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>
                            Bank Reconciliation
                        </h1>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
                            Match bank transactions with system records
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-secondary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={16} />
                            Auto-Match
                        </button>

                        <button className="btn btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={16} />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-blue">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{reconciliationStats.total}</div>
                    <div className="stat-label">Total Transactions</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-green">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{reconciliationStats.matched}</div>
                    <div className="stat-label">Matched</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-red">
                            <XCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{reconciliationStats.unmatched}</div>
                    <div className="stat-label">Unmatched</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon stat-icon-orange">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-value">{reconciliationStats.potential}</div>
                    <div className="stat-label">Potential Matches</div>
                </div>
            </div>

            {/* Controls */}
            <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        {/* File Upload */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="bank-statement-upload"
                            />
                            <label
                                htmlFor="bank-statement-upload"
                                className="btn btn-secondary"
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}
                            >
                                <Upload size={16} />
                                Upload CSV Statement
                            </label>
                        </div>

                        {/* Date Range */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} style={{ color: '#6b7280' }} />
                            <input
                                type="date"
                                value={reconciliationDate}
                                onChange={(e) => setReconciliationDate(e.target.value)}
                                className="filter-select"
                                style={{ width: 'auto' }}
                            />
                        </div>

                        {/* Period Filter */}
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="filter-select"
                        >
                            <option value="current-month">Current Month</option>
                            <option value="last-month">Last Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={16} />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} style={{ color: '#6b7280' }} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="matched">Matched</option>
                            <option value="unmatched">Unmatched</option>
                            <option value="potential">Potential</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <RefreshCw size={32} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem', color: '#6b7280' }}>Processing bank statement...</p>
                </div>
            )}

            {/* Reconciliation List */}
            {!isLoading && (
                <div className="dashboard-card">
                    <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                        Transaction Matching
                    </h2>

                    <div style={{ overflowX: 'auto' }}>
                        {filteredMatches.map((match, index) => (
                            <div
                                key={match.bankTransaction.id}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    padding: '1.5rem',
                                    marginBottom: '1rem',
                                    background: match.status === 'matched' ? 'rgba(16, 185, 129, 0.05)' :
                                        match.status === 'potential' ? 'rgba(245, 158, 11, 0.05)' :
                                            'rgba(239, 68, 68, 0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {getStatusIcon(match.status)}
                                        {getStatusBadge(match.status)}
                                        {match.confidence && (
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                {match.confidence}% confidence
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ width: 'auto', padding: '0.5rem', fontSize: '0.75rem' }}
                                        >
                                            <Eye size={14} />
                                        </button>

                                        {match.status !== 'matched' && (
                                            <>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{
                                                        width: 'auto',
                                                        padding: '0.5rem',
                                                        fontSize: '0.75rem',
                                                        background: '#059669',
                                                        color: 'white'
                                                    }}
                                                    onClick={() => handleManualMatch(index, match.systemTransaction?.id)}
                                                >
                                                    <Check size={14} />
                                                </button>

                                                <button
                                                    className="btn btn-secondary"
                                                    style={{
                                                        width: 'auto',
                                                        padding: '0.5rem',
                                                        fontSize: '0.75rem',
                                                        background: '#dc2626',
                                                        color: 'white'
                                                    }}
                                                    onClick={() => handleManualMatch(index)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {/* Bank Transaction */}
                                    <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.5rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                            Bank Transaction
                                        </h4>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong style={{ color: '#111827' }}>{match.bankTransaction.description}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Date:</span>
                                            <span style={{ fontSize: '0.875rem', color: '#111827' }}>{match.bankTransaction.date}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Amount:</span>
                                            <span style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: match.bankTransaction.amount > 0 ? '#059669' : '#dc2626'
                                            }}>
                                                ${Math.abs(match.bankTransaction.amount).toFixed(2)}
                                            </span>
                                        </div>
                                        {match.bankTransaction.reference && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reference:</span>
                                                <span style={{ fontSize: '0.875rem', color: '#111827' }}>{match.bankTransaction.reference}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* System Transaction */}
                                    <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.5rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                            System Transaction
                                        </h4>
                                        {match.systemTransaction ? (
                                            <>
                                                <div style={{ marginBottom: '0.5rem' }}>
                                                    <strong style={{ color: '#111827' }}>{match.systemTransaction.description}</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Date:</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#111827' }}>{match.systemTransaction.date}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Amount:</span>
                                                    <span style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        color: match.systemTransaction.type === 'income' ? '#059669' : '#dc2626'
                                                    }}>
                                                        ${match.systemTransaction.amount.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Category:</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#111827' }}>{match.systemTransaction.category}</span>
                                                </div>
                                                {match.systemTransaction.invoiceNumber && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Invoice:</span>
                                                        <span style={{ fontSize: '0.875rem', color: '#111827' }}>{match.systemTransaction.invoiceNumber}</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
                                                <XCircle size={24} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                                                <p style={{ margin: 0, fontSize: '0.875rem' }}>No matching system transaction found</p>
                                                <select
                                                    className="filter-select"
                                                    style={{ marginTop: '1rem', width: '100%' }}
                                                    onChange={(e) => handleManualMatch(index, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Select transaction to match</option>
                                                    {systemTransactions.map(sysTransaction => (
                                                        <option key={sysTransaction.id} value={sysTransaction.id}>
                                                            {sysTransaction.description} - ${sysTransaction.amount.toFixed(2)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMatches.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <FileText size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>No transactions found</h3>
                            <p style={{ margin: 0 }}>Upload a bank statement or adjust your filters to see transactions.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BankReconciliation;