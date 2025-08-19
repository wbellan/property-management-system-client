cat > src/components/dashboard/DashboardContent.tsx << 'EOF'
import React from 'react';
import { Home, DollarSign, TrendingUp, Calendar, Wrench, Plus, ChevronRight, BarChart3 } from 'lucide-react';

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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

interface DashboardContentProps {
  metrics: DashboardMetrics | null;
  user: User | null;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ metrics, user }) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h1 className="welcome-title">Good morning, {user?.firstName}!</h1>
          <p className="welcome-subtitle">Here's what's happening with your property portfolio today.</p>
          <div className="welcome-actions">
            <button className="btn btn-primary">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Add Property
            </button>
            <button className="btn btn-secondary">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-blue">
              <Home size={24} />
            </div>
            <span className="stat-trend stat-trend-up">
              <TrendingUp size={12} />
              +2.5%
            </span>
          </div>
          <h3 className="stat-value">{metrics.occupancy?.rate || 0}%</h3>
          <p className="stat-label">Occupancy Rate</p>
          <div className="stat-progress">
            <div 
              className="stat-progress-bar stat-progress-blue" 
              style={{ width: `${metrics.occupancy?.rate || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-green">
              <DollarSign size={24} />
            </div>
            <span className="stat-trend stat-trend-up">
              <TrendingUp size={12} />
              +8.2%
            </span>
          </div>
          <h3 className="stat-value">
            ${(metrics.financial?.monthlyRevenue || 0).toLocaleString()}
          </h3>
          <p className="stat-label">Monthly Revenue</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-orange">
              <Wrench size={24} />
            </div>
            <span className="stat-trend stat-trend-danger">
              {metrics.maintenance?.urgent || 0} urgent
            </span>
          </div>
          <h3 className="stat-value">{metrics.maintenance?.pending || 0}</h3>
          <p className="stat-label">Pending Tasks</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-purple">
              <Calendar size={24} />
            </div>
            <span className="stat-trend stat-trend-warning">
              30 days
            </span>
          </div>
          <h3 className="stat-value">{metrics.leases?.expiring || 0}</h3>
          <p className="stat-label">Expiring Leases</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Revenue Overview</h3>
              <p className="card-subtitle">Monthly performance across all properties</p>
            </div>
            <button className="view-details-btn">
              View details
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="chart-placeholder">
            <BarChart3 size={64} />
            <p>Interactive revenue chart will be rendered here</p>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="activity-card">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot activity-dot-green"></div>
                <div className="activity-content">
                  <p className="activity-title">New lease signed</p>
                  <p className="activity-time">Unit 4B - 2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot activity-dot-blue"></div>
                <div className="activity-content">
                  <p className="activity-title">Maintenance completed</p>
                  <p className="activity-time">HVAC repair - 4 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot activity-dot-orange"></div>
                <div className="activity-content">
                  <p className="activity-title">Payment received</p>
                  <p className="activity-time">$2,500 - 6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn quick-action-primary">
                Create New Lease
              </button>
              <button className="quick-action-btn quick-action-success">
                Add Maintenance Request
              </button>
              <button className="quick-action-btn quick-action-warning">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
EOF