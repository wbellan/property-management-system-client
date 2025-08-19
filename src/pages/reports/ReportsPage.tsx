import React, { useState, useEffect } from 'react';
import { ReportsContent } from '../../components/reports/ReportsContent';
import { useAuth } from '../../contexts/AuthContext';

// Define report interfaces
interface ReportData {
  [key: string]: any;
}

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Record<string, ReportData>>({});
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('dashboard');
  const { user, token } = useAuth();

  const loadReport = async (reportType: string) => {
    setLoading(true);
    try {
      // Mock report data
      const mockReportData = {
        dashboard: {
          totalRevenue: 547200,
          totalExpenses: 123400,
          netIncome: 423800,
          occupancyRate: 87.5,
          avgRentPerUnit: 1520,
          maintenanceCosts: 15600
        },
        'profit-loss': {
          revenue: {
            rent: 425000,
            fees: 45000,
            other: 22000,
            total: 492000
          },
          expenses: {
            maintenance: 15600,
            utilities: 24000,
            insurance: 18000,
            taxes: 32000,
            management: 28000,
            total: 117600
          },
          netIncome: 374400,
          profitMargin: 76.1
        },
        occupancy: {
          totalUnits: 120,
          occupiedUnits: 105,
          vacantUnits: 15,
          occupancyRate: 87.5,
          avgDaysVacant: 12,
          turnoverRate: 8.2
        },
        'cash-flow': {
          monthlyData: [
            { month: 'Jan', income: 45600, expenses: 12400, netCashFlow: 33200 },
            { month: 'Feb', income: 47200, expenses: 11800, netCashFlow: 35400 },
            { month: 'Mar', income: 46800, expenses: 13200, netCashFlow: 33600 },
            { month: 'Apr', income: 48400, expenses: 12600, netCashFlow: 35800 },
            { month: 'May', income: 47600, expenses: 14200, netCashFlow: 33400 },
            { month: 'Jun', income: 49200, expenses: 13400, netCashFlow: 35800 }
          ]
        }
      };

      await new Promise(resolve => setTimeout(resolve, 800));
      setReports(prev => ({ ...prev, [reportType]: mockReportData[reportType] }));
    } catch (error) {
      console.error(`Failed to load ${reportType} report:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedReport);
  }, [selectedReport]);

  return (
    <ReportsContent
      reports={reports}
      loading={loading}
      selectedReport={selectedReport}
      onReportSelect={setSelectedReport}
      onRefresh={() => loadReport(selectedReport)}
    />
  );
};
