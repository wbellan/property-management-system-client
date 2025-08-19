export interface DashboardMetrics {
  occupancy: {
    rate: number;
    totalSpaces: number;
    occupiedSpaces: number;
  };
  financial: {
    monthlyRevenue: number;
    totalRevenue: number;
    totalExpenses: number;
  };
  maintenance: {
    pending: number;
    urgent: number;
    completed: number;
  };
  leases: {
    expiring: number;
    total: number;
    newThisMonth: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'lease' | 'maintenance' | 'payment' | 'property';
  title: string;
  description: string;
  timestamp: string;
  color: string;
}
