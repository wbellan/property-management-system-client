import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardContent } from '../../components/dashboard/DashboardContent';

// Define interfaces directly here
interface DashboardMetrics {
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

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // Mock data for demo
        const mockMetrics: DashboardMetrics = {
          occupancy: {
            rate: 87.5,
            totalSpaces: 120,
            occupiedSpaces: 105,
          },
          financial: {
            monthlyRevenue: 45600,
            totalRevenue: 547200,
            totalExpenses: 123400,
          },
          maintenance: {
            pending: 8,
            urgent: 2,
            completed: 24,
          },
          leases: {
            expiring: 5,
            total: 105,
            newThisMonth: 3,
          },
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center">
        <div className="card">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <p className="subtitle">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient" style={{ padding: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <DashboardContent metrics={metrics} user={user} />
      </div>
    </div>
  );
};
