// src/pages/dashboard/DashboardPage.tsx - Simple Dashboard Fix
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardContent } from '../../components/dashboard/DashboardContent';
import { apiService } from '../../services/api/apiService';

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

        console.log('Loading dashboard for organization:', user.organizationId);
        console.log('User role:', user.role);
        console.log('User entities:', user.entities);

        // Use organization ID instead of entity ID
        const data = await apiService.getOrganizationDashboardMetrics(
          user.organizationId, // Use organizationId instead of entityId
          token
        );

        console.log('Dashboard metrics loaded:', data);
        setMetrics(data.data); // data.data because your API returns { success: true, data: {...} }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    // const loadMetrics = async () => {
    //   if (!user || !token) return;

    //   setLoading(true);
    //   setError(null);

    //   try {
    //     // Try to get entity ID from user
    //     let entityId = null;

    //     // Check different possible entity sources
    //     if (user.entities && user.entities.length > 0) {
    //       entityId = user.entities[0].id;
    //     } else if (user.organizationId) {
    //       // Fallback to organization ID if no entities
    //       entityId = user.organizationId;
    //     }

    //     if (!entityId) {
    //       throw new Error('No entity access available');
    //     }

    //     console.log('Loading dashboard for entity:', entityId);

    //     // Call your existing API service method
    //     const response = await apiService.getDashboardMetrics(entityId, token);

    //     // Handle the response data
    //     const data = response.data || response;
    //     console.log('Dashboard data received:', data);

    //     setMetrics(data);

    //   } catch (error: any) {
    //     console.error('Dashboard load error:', error);
    //     setError(error.message || 'Failed to load dashboard');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    loadMetrics();
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3">Loading dashboard...</span>
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
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <DashboardContent metrics={metrics} user={user} />;
};