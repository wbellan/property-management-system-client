// In src/pages/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';

// Import role-specific dashboards
import { AdminDashboard } from '../../components/dashboard/AdminDashboard'; // Your existing DashboardContent
import { PropertyManagerDashboard } from '../../components/dashboard/PropertyManagerDashboard';
import { AccountantDashboard } from '../../components/dashboard/AccountantDashboard';
import { MaintenanceDashboard } from '../../components/dashboard/MaintenanceDashboard';
import { TenantDashboard } from '../../components/dashboard/TenantDashboard';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadMetrics = async () => {
      if (!user || !token) return;

      try {
        setLoading(true);
        // Use organization dashboard endpoint
        const data = await apiService.getOrganizationDashboardMetrics(
          user.organizationId,
          token
        );
        setMetrics(data.data); // Backend returns { success: true, data: {...} }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'ORG_ADMIN':
      case 'ENTITY_MANAGER':
        return <AdminDashboard metrics={metrics} user={user} />;

      case 'PROPERTY_MANAGER':
        return <PropertyManagerDashboard metrics={metrics} user={user} />;

      case 'ACCOUNTANT':
        return <AccountantDashboard metrics={metrics} user={user} />;

      case 'MAINTENANCE':
        return <MaintenanceDashboard metrics={metrics} user={user} />;

      case 'TENANT':
        return <TenantDashboard metrics={metrics} user={user} />;

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Dashboard not available for your role.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboard()}
    </div>
  );
};