// src/components/financial/FinancialReports.tsx
import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    Filter,
    RefreshCw,
    FileText,
    DollarSign,
    PieChart,
    Activity,
    Target,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    Eye,
    Settings
} from 'lucide-react';

interface FinancialReport {
    id: string;
    name: string;
    description: string;
    icon: any;
    category: 'FINANCIAL' | 'OPERATIONAL' | 'ANALYTICAL';
    data?: any;
    lastGenerated?: string;
}

interface ProfitLossData {
    period: string;
    revenue: {
        rental: number;
        fees: number;
        other: number;
        total: number;
    };
    expenses: {
        maintenance: number;
        utilities: number;
        insurance: number;
        management: number;
        other: number;
        total: number;
    };
    netIncome: number;
    margin: number;
}

interface BalanceSheetData {
    asOfDate: string;
    assets: {
        current: {
            cash: number;
            accountsReceivable: number;
            deposits: number;
            total: number;
        };
        fixed: {
            propertyValue: number;
            equipment: number;
            total: number;
        };
        total: number;
    };
    liabilities: {
        current: {
            accountsPayable: number;
            accruals: number;
            deposits: number;
            total: number;
        };
        longTerm: {
            mortgages: number;
            loans: number;
            total: number;
        };
        total: number;
    };
    equity: {
        ownerEquity: number;
        retainedEarnings: number;
        total: number;
    };
}

interface CashFlowData {
    period: string;
    operating: {
        netIncome: number;
        depreciation: number;
        receivables: number;
        payables: number;
        total: number;
    };
    investing: {
        propertyImprovements: number;
        equipmentPurchases: number;
        total: number;
    };
    financing: {
        loanProceeds: number;
        loanPayments: number;
        ownerContributions: number;
        distributions: number;
        total: number;
    };
    netCashFlow: number;
}

const FinancialReports: React.FC = () => {
    const [reports, setReports] = useState<FinancialReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: '2025-01-01',
        endDate: '2025-01-31'
    });
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        // Mock financial reports
        const mockReports: FinancialReport[] = [
            {
                id: 'profit-loss',
                name: 'Profit & Loss Statement',
                description: 'Revenue and expense analysis for selected period',
                icon: TrendingUp,
                category: 'FINANCIAL',
                lastGenerated: '2025-01-20'
            },
            {
                id: 'balance-sheet',
                name: 'Balance Sheet',
                description: 'Assets, liabilities, and equity summary',
                icon: BarChart3,
                category: 'FINANCIAL',
                lastGenerated: '2025-01-15'
            },
            {
                id: 'cash-flow',
                name: 'Cash Flow Statement',
                description: 'Operating, investing, and financing cash flows',
                icon: Activity,
                category: 'FINANCIAL',
                lastGenerated: '2025-01-18'
            },
            {
                id: 'ar-aging',
                name: 'Accounts Receivable Aging',
                description: 'Outstanding invoices by aging buckets',
                icon: FileText,
                category: 'OPERATIONAL',
                lastGenerated: '2025-01-22'
            },
            {
                id: 'expense-analysis',
                name: 'Expense Analysis',
                description: 'Detailed breakdown of expenses by category',
                icon: PieChart,
                category: 'ANALYTICAL',
                lastGenerated: '2025-01-19'
            },
            {
                id: 'rent-roll',
                name: 'Rent Roll Report',
                description: 'Comprehensive lease and payment analysis',
                icon: DollarSign,
                category: 'OPERATIONAL',
                lastGenerated: '2025-01-21'
            }
        ];

        setTimeout(() => {
            setReports(mockReports);
            setSelectedReport(mockReports[0]);
            setLoading(false);
        }, 1000);
    }, []);

    const generateReportData = (reportId: string) => {
        setLoading(true);

        // Mock API call delay
        setTimeout(() => {
            switch (reportId) {
                case 'profit-loss':
                    const plData: ProfitLossData = {
                        period: `${dateRange.startDate} to ${dateRange.endDate}`,
                        revenue: {
                            rental: 45600,
                            fees: 3200,
                            other: 1800,
                            total: 50600
                        },
                        expenses: {
                            maintenance: 8500,
                            utilities: 6200,
                            insurance: 4800,
                            management: 7600,
                            other: 3200,
                            total: 30300
                        },
                        netIncome: 20300,
                        margin: 40.1
                    };
                    setReportData(plData);
                    break;

                case 'balance-sheet':
                    const bsData: BalanceSheetData = {
                        asOfDate: dateRange.endDate,
                        assets: {
                            current: {
                                cash: 125000,
                                accountsReceivable: 18500,
                                deposits: 8500,
                                total: 152000
                            },
                            fixed: {
                                propertyValue: 2850000,
                                equipment: 45000,
                                total: 2895000
                            },
                            total: 3047000
                        },
                        liabilities: {
                            current: {
                                accountsPayable: 12000,
                                accruals: 8500,
                                deposits: 45000,
                                total: 65500
                            },
                            longTerm: {
                                mortgages: 1850000,
                                loans: 125000,
                                total: 1975000
                            },
                            total: 2040500
                        },
                        equity: {
                            ownerEquity: 850000,
                            retainedEarnings: 156500,
                            total: 1006500
                        }
                    };
                    setReportData(bsData);
                    break;

                case 'cash-flow':
                    const cfData: CashFlowData = {
                        period: `${dateRange.startDate} to ${dateRange.endDate}`,
                        operating: {
                            netIncome: 20300,
                            depreciation: 8500,
                            receivables: -2500,
                            payables: 1800,
                            total: 28100
                        },
                        investing: {
                            propertyImprovements: -15000,
                            equipmentPurchases: -3500,
                            total: -18500
                        },
                        financing: {
                            loanProceeds: 0,
                            loanPayments: -12500,
                            ownerContributions: 25000,
                            distributions: -15000,
                            total: -2500
                        },
                        netCashFlow: 7100
                    };
                    setReportData(cfData);
                    break;

                default:
                    setReportData({
                        message: `${reportId} data not available in demo`,
                        period: `${dateRange.startDate} to ${dateRange.endDate}`
                    });
            }
            setLoading(false);
        }, 1500);
    };

    const renderProfitLoss = (data: ProfitLossData) => (
        <div className="space-y-6">
            {/* Revenue Section */}
            <div className="chart-card">
                <div className="card-header">
                    <h3 className="card-title">Revenue</h3>
                </div>
                <div className="space-y-3">
                    {Object.entries(data.revenue).filter(([key]) => key !== 'total').map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>${value.toLocaleString()}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '2px solid rgba(16, 185, 129, 0.2)' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Total Revenue</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>${data.revenue.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Expenses Section */}
            <div className="chart-card">
                <div className="card-header">
                    <h3 className="card-title">Expenses</h3>
                </div>
                <div className="space-y-3">
                    {Object.entries(data.expenses).filter(([key]) => key !== 'total').map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626' }}>${value.toLocaleString()}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '2px solid rgba(239, 68, 68, 0.2)' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Total Expenses</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#dc2626' }}>${data.expenses.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Net Income Section */}
            <div className="chart-card">
                <div className="card-header">
                    <h3 className="card-title">Net Income Summary</h3>
                </div>
                <div className="space-y-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '0.75rem', color: 'white' }}>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Net Income</div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Profit Margin: {data.margin}%</div>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                            ${data.netIncome.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBalanceSheet = (data: BalanceSheetData) => (
        <div className="space-y-6">
            {/* Assets Section */}
            <div className="chart-card">
                <div className="card-header">
                    <h3 className="card-title">Assets</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Current Assets</h4>
                        <div className="space-y-2">
                            {Object.entries(data.assets.current).filter(([key]) => key !== 'total').map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>${value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Total Current Assets</span>
                                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#2563eb' }}>${data.assets.current.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Fixed Assets</h4>
                        <div className="space-y-2">
                            {Object.entries(data.assets.fixed).filter(([key]) => key !== 'total').map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>${value.toLocaleString()}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Total Fixed Assets</span>
                                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#2563eb' }}>${data.assets.fixed.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', borderRadius: '0.75rem', color: 'white' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>Total Assets</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>${data.assets.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Liabilities */}
                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Liabilities</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Current Liabilities</h4>
                            {Object.entries(data.liabilities.current).filter(([key]) => key !== 'total').map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>${value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Long-term Liabilities</h4>
                            {Object.entries(data.liabilities.longTerm).filter(([key]) => key !== 'total').map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{key}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>${value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Total Liabilities</span>
                                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#dc2626' }}>${data.liabilities.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equity */}
                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Owner's Equity</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(data.equity).filter(([key]) => key !== 'total').map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(249, 250, 251, 0.5)', borderRadius: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>${value.toLocaleString()}</span>
                            </div>
                        ))}
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Total Equity</span>
                                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#059669' }}>${data.equity.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCashFlow = (data: CashFlowData) => (
        <div className="space-y-6">
            {/* Operating Activities */}
            <div className="chart-card">
                <div className="card-header">
                    <h3 className="card-title">Operating Activities</h3>
                </div>
                <div className="space-y-3">
                    {Object.entries(data.operating).filter(([key]) => key !== 'total').map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(249, 250, 251, 0.5)', borderRadius: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span style={{ fontSize: '1rem', fontWeight: '600', color: value >= 0 ? '#059669' : '#dc2626' }}>
                                {value >= 0 ? '+' : ''}${value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '2px solid rgba(59, 130, 246, 0.2)' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Net Operating Cash Flow</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: data.operating.total >= 0 ? '#059669' : '#dc2626' }}>
                            {data.operating.total >= 0 ? '+' : ''}${data.operating.total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Investing & Financing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Investing Activities */}
                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Investing Activities</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(data.investing).filter(([key]) => key !== 'total').map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: value >= 0 ? '#059669' : '#dc2626' }}>
                                    {value >= 0 ? '+' : ''}${value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Net Investing</span>
                                <span style={{ fontSize: '1rem', fontWeight: '700', color: data.investing.total >= 0 ? '#059669' : '#dc2626' }}>
                                    {data.investing.total >= 0 ? '+' : ''}${data.investing.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financing Activities */}
                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Financing Activities</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(data.financing).filter(([key]) => key !== 'total').map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: value >= 0 ? '#059669' : '#dc2626' }}>
                                    {value >= 0 ? '+' : ''}${value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>Net Financing</span>
                                <span style={{ fontSize: '1rem', fontWeight: '700', color: data.financing.total >= 0 ? '#059669' : '#dc2626' }}>
                                    {data.financing.total >= 0 ? '+' : ''}${data.financing.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Cash Flow Summary */}
            <div className="chart-card">
                <div className="card-header">
                    <h3 className="card-title">Net Cash Flow Summary</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '0.75rem', color: 'white' }}>
                    <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Net Cash Flow</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>For period: {data.period}</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                        {data.netCashFlow >= 0 ? '+' : ''}${data.netCashFlow.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading && !selectedReport) {
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
                    <h1 className="welcome-title">Financial Reports</h1>
                    <p className="welcome-subtitle">Comprehensive financial analysis and reporting suite</p>
                    <div className="welcome-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => selectedReport && generateReportData(selectedReport.id)}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Generate Report
                        </button>
                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Range Selection */}
            <div className="chart-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Report Period:</span>
                    </div>

                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        style={{
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(249, 250, 251, 0.5)',
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                        }}
                    />

                    <span style={{ color: '#6b7280' }}>to</span>

                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        style={{
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(249, 250, 251, 0.5)',
                            border: '1px solid rgba(229, 231, 235, 0.5)',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
            </div>

            {/* Report Selection & Content */}
            <div className="content-grid">
                {/* Report List */}
                <div className="sidebar-content">
                    <div className="activity-card">
                        <div className="card-header">
                            <h3 className="card-title">Available Reports</h3>
                        </div>
                        <div className="space-y-3">
                            {reports.map((report) => {
                                const IconComponent = report.icon;
                                const isSelected = selectedReport?.id === report.id;

                                return (
                                    <div
                                        key={report.id}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(229, 231, 235, 0.5)',
                                            background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'rgba(249, 250, 251, 0.5)'
                                        }}
                                        onClick={() => {
                                            setSelectedReport(report);
                                            setReportData(null);
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <div style={{
                                                width: '2rem',
                                                height: '2rem',
                                                borderRadius: '0.375rem',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white'
                                            }}>
                                                <IconComponent size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                                    {report.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                    {report.category}
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                                            {report.description}
                                        </p>
                                        {report.lastGenerated && (
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                                                Last: {new Date(report.lastGenerated).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                <div className="chart-card">
                    <div className="card-header">
                        {selectedReport && (
                            <div>
                                <h2 className="card-title">{selectedReport.name}</h2>
                                <p className="card-subtitle">{selectedReport.description}</p>
                            </div>
                        )}
                    </div>

                    {loading && reportData === null ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                            <div className="loading-spinner"></div>
                        </div>
                    ) : reportData ? (
                        <div>
                            {selectedReport?.id === 'profit-loss' && renderProfitLoss(reportData)}
                            {selectedReport?.id === 'balance-sheet' && renderBalanceSheet(reportData)}
                            {selectedReport?.id === 'cash-flow' && renderCashFlow(reportData)}
                            {selectedReport?.id && !['profit-loss', 'balance-sheet', 'cash-flow'].includes(selectedReport.id) && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                        {selectedReport.name}
                                    </h3>
                                    <p>{reportData.message}</p>
                                    <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                                        Period: {reportData.period}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <BarChart3 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                Select a Report
                            </h3>
                            <p>Choose a report from the sidebar to view detailed financial analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;