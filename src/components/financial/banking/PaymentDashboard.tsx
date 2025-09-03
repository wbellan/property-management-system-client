// src/components/financial/banking/PaymentDashboard.tsx - LAYOUT FIXES ONLY, ALL FUNCTIONALITY PRESERVED
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    Receipt,
    CheckSquare,
    Clock,
    DollarSign,
    Calendar,
    Building2,
    FileText,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { bankingService } from '../../../services/api/bankingService';
import { apiService } from '../../../services/api/apiService';

interface Payment {
    id: string;
    amount: string;
    paymentType: string;
    paymentMethod: string;
    status: string;
    processingStatus: string;
    paymentDate: string;
    referenceNumber?: string;
    reconciledAt?: string;
    invoice?: {
        id: string;
        invoiceNumber: string;
        customerName: string;
    };
}

interface Entity {
    id: string;
    name: string;
}

const PaymentDashboard: React.FC = () => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [dateFilter, setDateFilter] = useState<string>('30D');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('ALL');
    const [reconciliationFilter, setReconciliationFilter] = useState<string>('ALL');

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedEntity) {
            loadPayments();
        }
    }, [selectedEntity]);

    useEffect(() => {
        applyFilters();
    }, [payments, searchTerm, statusFilter, dateFilter, paymentMethodFilter, reconciliationFilter]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const entitiesResponse = await apiService.getEntities();
            setEntities(entitiesResponse.data || []);
            if (entitiesResponse.data && entitiesResponse.data.length > 0) {
                setSelectedEntity(entitiesResponse.data[0].id);
            }
        } catch (err: any) {
            setError(`Failed to load entities: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const loadPayments = async () => {
        if (!selectedEntity) return;

        try {
            setLoading(true);
            setError(null);

            // Get unreconciled payments using our banking service
            const unreconciledResponse = await bankingService.getUnreconciledPayments(selectedEntity, {
                dateFrom: getDateFilter(dateFilter)
            });

            setPayments(unreconciledResponse.payments || []);
        } catch (err: any) {
            setError(`Failed to load payments: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...payments];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(payment =>
                payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.invoice?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.invoice?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }

        // Payment method filter
        if (paymentMethodFilter !== 'ALL') {
            filtered = filtered.filter(payment => payment.paymentType === paymentMethodFilter);
        }

        // Reconciliation filter
        if (reconciliationFilter === 'RECONCILED') {
            filtered = filtered.filter(payment => payment.reconciledAt);
        } else if (reconciliationFilter === 'UNRECONCILED') {
            filtered = filtered.filter(payment => !payment.reconciledAt);
        }

        // Date filter
        if (dateFilter !== 'ALL') {
            const cutoffDate = new Date();
            const days = { '7D': 7, '30D': 30, '90D': 90 }[dateFilter] || 30;
            cutoffDate.setDate(cutoffDate.getDate() - days);

            filtered = filtered.filter(payment =>
                new Date(payment.paymentDate) >= cutoffDate
            );
        }

        setFilteredPayments(filtered);
    };

    const getDateFilter = (filter: string) => {
        if (filter === 'ALL') return undefined;
        const cutoffDate = new Date();
        const days = { '7D': 7, '30D': 30, '90D': 90 }[filter] || 30;
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return cutoffDate.toISOString().split('T')[0];
    };

    const handleGenerateReceipt = async (paymentId: string) => {
        if (!selectedEntity) return;

        try {
            const response = await bankingService.generateReceipt(selectedEntity, paymentId, {
                format: 'PDF',
                includeInvoiceDetails: true
            });

            // Handle receipt download/display
            console.log('Receipt generated:', response);
            alert('Receipt generated successfully!');
        } catch (err: any) {
            setError(`Failed to generate receipt: ${err.message}`);
        }
    };

    const handleReconcilePayment = async (paymentId: string) => {
        if (!selectedEntity) return;

        try {
            await bankingService.reconcilePayment(selectedEntity, paymentId, {
                reconciledAt: new Date().toISOString(),
                notes: 'Manually reconciled'
            });

            // Reload payments to reflect changes
            await loadPayments();
        } catch (err: any) {
            setError(`Failed to reconcile payment: ${err.message}`);
        }
    };

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#16a34a';
            case 'PENDING': return '#eab308';
            case 'FAILED': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'CHECK': return <CheckSquare className="w-4 h-4" />;
            case 'CASH': return <DollarSign className="w-4 h-4" />;
            case 'ACH': return <Building2 className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    // Calculate summary statistics
    const stats = {
        totalPayments: filteredPayments.length,
        totalAmount: filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
        reconciledCount: filteredPayments.filter(p => p.reconciledAt).length,
        unreconciledCount: filteredPayments.filter(p => !p.reconciledAt).length,
    };

    if (loading && entities.length === 0) {
        return (
            <div className="properties-loading">
                <Loader2 className="animate-spin" style={{ width: '2rem', height: '2rem', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading Payment Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ padding: '2rem' }}>
            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            {/* Header - FIXED LAYOUT */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#111827',
                        margin: '0 0 0.5rem 0'
                    }}>
                        Payment Dashboard
                    </h1>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        View, manage, and reconcile all recorded payments
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={loadPayments}
                        disabled={loading || !selectedEntity}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            borderRadius: '0.5rem',
                            cursor: loading || !selectedEntity ? 'not-allowed' : 'pointer',
                            opacity: loading || !selectedEntity ? 0.6 : 1
                        }}
                    >
                        <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Entity Selection - IMPROVED LAYOUT */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    maxWidth: '400px'
                }}>
                    <Building2 style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        color: '#6b7280',
                        flexShrink: 0
                    }} />
                    <select
                        value={selectedEntity}
                        onChange={(e) => setSelectedEntity(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <option value="">Select Entity</option>
                        {entities.map(entity => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards - FIXED GRID LAYOUT */}
            {selectedEntity && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                color: '#3b82f6'
                            }}>
                                <FileText style={{ width: '1.5rem', height: '1.5rem' }} />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: '#111827'
                                }}>
                                    {stats.totalPayments}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280'
                                }}>
                                    Total Payments
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981'
                            }}>
                                <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: '#111827'
                                }}>
                                    {formatCurrency(stats.totalAmount)}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280'
                                }}>
                                    Total Amount
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                color: '#8b5cf6'
                            }}>
                                <CheckSquare style={{ width: '1.5rem', height: '1.5rem' }} />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: '#111827'
                                }}>
                                    {stats.reconciledCount}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280'
                                }}>
                                    Reconciled
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                color: '#f59e0b'
                            }}>
                                <Clock style={{ width: '1.5rem', height: '1.5rem' }} />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: '#111827'
                                }}>
                                    {stats.unreconciledCount}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280'
                                }}>
                                    Pending
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters - IMPROVED RESPONSIVE LAYOUT */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '1.25rem',
                            height: '1.25rem',
                            color: '#6b7280',
                            pointerEvents: 'none'
                        }} />
                        <input
                            type="text"
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                paddingLeft: '2.75rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>

                    <select
                        value={paymentMethodFilter}
                        onChange={(e) => setPaymentMethodFilter(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <option value="ALL">All Methods</option>
                        <option value="CHECK">Check</option>
                        <option value="CASH">Cash</option>
                        <option value="ACH">ACH</option>
                        <option value="WIRE_TRANSFER">Wire</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                    </select>

                    <select
                        value={reconciliationFilter}
                        onChange={(e) => setReconciliationFilter(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <option value="ALL">All Reconciliation</option>
                        <option value="RECONCILED">Reconciled</option>
                        <option value="UNRECONCILED">Unreconciled</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <option value="ALL">All Time</option>
                        <option value="7D">Last 7 Days</option>
                        <option value="30D">Last 30 Days</option>
                        <option value="90D">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Payments Table - IMPROVED STYLING */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ overflow: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        tableLayout: 'fixed'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f9fafb',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Payment</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Customer</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'right',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Amount</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Method</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Status</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Date</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Reconciled</th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    color: '#111827'
                                }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                        <Loader2 className="animate-spin" style={{
                                            width: '1.5rem',
                                            height: '1.5rem',
                                            margin: '0 auto',
                                            color: '#6b7280'
                                        }} />
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{
                                        textAlign: 'center',
                                        padding: '2rem',
                                        color: '#6b7280',
                                        fontSize: '0.875rem'
                                    }}>
                                        No payments found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} style={{
                                        borderBottom: '1px solid #f3f4f6',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>
                                                    {payment.referenceNumber || payment.id.slice(0, 8)}
                                                </div>
                                                {payment.invoice && (
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        Invoice: {payment.invoice.invoiceNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                                                {payment.invoice?.customerName || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>
                                                {formatCurrency(payment.amount)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                {getPaymentMethodIcon(payment.paymentType)}
                                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                    {payment.paymentType}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: `${getStatusColor(payment.status)}20`,
                                                color: getStatusColor(payment.status)
                                            }}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {payment.reconciledAt ? (
                                                <CheckSquare style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                    color: '#16a34a',
                                                    margin: '0 auto'
                                                }} />
                                            ) : (
                                                <Clock style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                    color: '#eab308',
                                                    margin: '0 auto'
                                                }} />
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                justifyContent: 'center'
                                            }}>
                                                <button
                                                    onClick={() => handleGenerateReceipt(payment.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid #d1d5db',
                                                        padding: '0.375rem',
                                                        borderRadius: '0.375rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: '#6b7280',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    title="Generate Receipt"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                        e.currentTarget.style.borderColor = '#9ca3af';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.borderColor = '#d1d5db';
                                                    }}
                                                >
                                                    <Receipt style={{ width: '0.875rem', height: '0.875rem' }} />
                                                </button>
                                                {!payment.reconciledAt && (
                                                    <button
                                                        onClick={() => handleReconcilePayment(payment.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: '1px solid #d1fae5',
                                                            padding: '0.375rem',
                                                            borderRadius: '0.375rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            color: '#059669',
                                                            backgroundColor: '#f0fdf4',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        title="Mark as Reconciled"
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#dcfce7';
                                                            e.currentTarget.style.borderColor = '#bbf7d0';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                                                            e.currentTarget.style.borderColor = '#d1fae5';
                                                        }}
                                                    >
                                                        <CheckSquare style={{ width: '0.875rem', height: '0.875rem' }} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentDashboard;