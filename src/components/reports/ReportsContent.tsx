import React from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Home,
  TrendingUp,
  FileText,
  Wrench,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface ReportsContentProps {
  reports: Record<string, any>;
  loading: boolean;
  selectedReport: string;
  onReportSelect: (reportType: string) => void;
  onRefresh: () => void;
}

const reportTypes = [
  {
    id: 'dashboard',
    label: 'Dashboard Metrics',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-cyan-500',
    description: 'Key performance indicators overview'
  },
  {
    id: 'profit-loss',
    label: 'P&L Statement',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    description: 'Profit and loss analysis'
  },
  {
    id: 'occupancy',
    label: 'Occupancy Analytics',
    icon: Home,
    color: 'from-purple-500 to-pink-500',
    description: 'Vacancy and occupancy trends'
  },
  {
    id: 'cash-flow',
    label: 'Cash Flow Analysis',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    description: 'Income and expense flow'
  },
  {
    id: 'rent-roll',
    label: 'Rent Roll',
    icon: FileText,
    color: 'from-indigo-500 to-purple-500',
    description: 'Current rent schedule'
  },
  {
    id: 'maintenance',
    label: 'Maintenance Analytics',
    icon: Wrench,
    color: 'from-yellow-500 to-orange-500',
    description: 'Maintenance costs and trends'
  }
];

export const ReportsContent: React.FC<ReportsContentProps> = ({
  reports,
  loading,
  selectedReport,
  onReportSelect,
  onRefresh
}) => {
  const currentReportData = reports[selectedReport];
  const selectedReportConfig = reportTypes.find(r => r.id === selectedReport);

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="report-loading">
          <div className="loading-spinner"></div>
          <p>Generating report...</p>
        </div>
      );
    }

    if (!currentReportData) {
      return (
        <div className="report-empty">
          <BarChart3 size={64} className="empty-icon" />
          <h3>No data available</h3>
          <p>Unable to load report data at this time.</p>
          <button onClick={onRefresh} className="btn btn-primary">
            Try Again
          </button>
        </div>
      );
    }

    switch (selectedReport) {
      case 'dashboard':
        return (
          <div className="report-dashboard">
            <div className="report-metrics-grid">
              <div className="report-metric-card">
                <div className="metric-icon metric-icon-green">
                  <DollarSign size={20} />
                </div>
                <div className="metric-content">
                  <h3>${currentReportData.totalRevenue?.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="report-metric-card">
                <div className="metric-icon metric-icon-red">
                  <TrendingUp size={20} />
                </div>
                <div className="metric-content">
                  <h3>${currentReportData.totalExpenses?.toLocaleString()}</h3>
                  <p>Total Expenses</p>
                </div>
              </div>
              <div className="report-metric-card">
                <div className="metric-icon metric-icon-blue">
                  <Activity size={20} />
                </div>
                <div className="metric-content">
                  <h3>${currentReportData.netIncome?.toLocaleString()}</h3>
                  <p>Net Income</p>
                </div>
              </div>
              <div className="report-metric-card">
                <div className="metric-icon metric-icon-purple">
                  <Home size={20} />
                </div>
                <div className="metric-content">
                  <h3>{currentReportData.occupancyRate}%</h3>
                  <p>Occupancy Rate</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profit-loss':
        return (
          <div className="report-profit-loss">
            <div className="pl-section">
              <h3 className="pl-section-title">Revenue</h3>
              <div className="pl-items">
                <div className="pl-item">
                  <span>Rent Income</span>
                  <span>${currentReportData.revenue?.rent?.toLocaleString()}</span>
                </div>
                <div className="pl-item">
                  <span>Fees & Other</span>
                  <span>${currentReportData.revenue?.fees?.toLocaleString()}</span>
                </div>
                <div className="pl-item pl-item-total">
                  <span>Total Revenue</span>
                  <span>${currentReportData.revenue?.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="pl-section">
              <h3 className="pl-section-title">Expenses</h3>
              <div className="pl-items">
                <div className="pl-item">
                  <span>Maintenance</span>
                  <span>${currentReportData.expenses?.maintenance?.toLocaleString()}</span>
                </div>
                <div className="pl-item">
                  <span>Utilities</span>
                  <span>${currentReportData.expenses?.utilities?.toLocaleString()}</span>
                </div>
                <div className="pl-item">
                  <span>Insurance</span>
                  <span>${currentReportData.expenses?.insurance?.toLocaleString()}</span>
                </div>
                <div className="pl-item pl-item-total">
                  <span>Total Expenses</span>
                  <span>${currentReportData.expenses?.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="pl-summary">
              <div className="pl-net-income">
                <span>Net Income</span>
                <span>${currentReportData.netIncome?.toLocaleString()}</span>
              </div>
              <div className="pl-margin">
                <span>Profit Margin</span>
                <span>{currentReportData.profitMargin}%</span>
              </div>
            </div>
          </div>
        );

      case 'occupancy':
        return (
          <div className="report-occupancy">
            <div className="occupancy-overview">
              <div className="occupancy-stat">
                <div className="occupancy-number">{currentReportData.totalUnits}</div>
                <div className="occupancy-label">Total Units</div>
              </div>
              <div className="occupancy-stat">
                <div className="occupancy-number">{currentReportData.occupiedUnits}</div>
                <div className="occupancy-label">Occupied</div>
              </div>
              <div className="occupancy-stat">
                <div className="occupancy-number">{currentReportData.vacantUnits}</div>
                <div className="occupancy-label">Vacant</div>
              </div>
              <div className="occupancy-stat">
                <div className="occupancy-number">{currentReportData.occupancyRate}%</div>
                <div className="occupancy-label">Occupancy Rate</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="report-placeholder">
            <PieChart size={64} className="placeholder-icon" />
            <h3>{selectedReportConfig?.label}</h3>
            <p>This report is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="reports-container">
      {/* Header matching MaintenanceContent structure exactly */}
      <div className="maintenance-header">
        <div>
          <h1 className="properties-title">Analytics & Reports</h1>
          <p className="properties-subtitle">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="maintenance-actions">
          <button className="btn btn-primary">
            <Download style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-types-grid">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => onReportSelect(report.id)}
            className={`report-type-card ${selectedReport === report.id ? 'report-type-active' : ''}`}
          >
            <div className={`report-type-icon bg-gradient-to-r ${report.color}`}>
              <report.icon size={20} />
            </div>
            <div className="report-type-content">
              <h3 className="report-type-title">{report.label}</h3>
              <p className="report-type-description">{report.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Report Content */}
      <div className="report-content-card">
        <div className="report-content-header">
          <div className="report-content-title">
            <div className={`report-content-icon bg-gradient-to-r ${selectedReportConfig?.color}`}>
              {selectedReportConfig?.icon && <selectedReportConfig.icon size={20} />}
            </div>
            <div>
              <h2>{selectedReportConfig?.label}</h2>
              <p>{selectedReportConfig?.description}</p>
            </div>
          </div>
          <div className="report-content-actions">
            <button onClick={onRefresh} className="btn btn-secondary">
              <Activity size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="report-content-body">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};