// src/components/dashboard/DashboardContent.tsx - Simple Fix Only
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  DollarSign,
  TrendingUp,
  Calendar,
  Wrench,
  Plus,
  ChevronRight,
  BarChart3,
  UserPlus,
  UserCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const getGradientColors = (colorClass: string) => {
  const colorMap = {
    'from-indigo-500 to-purple-600': '#6366f1, #7c3aed',
    'from-green-500 to-emerald-500': '#10b981, #059669',
    'from-blue-500 to-cyan-500': '#3b82f6, #06b6d4',
    'from-orange-500 to-red-500': '#f59e0b, #ef4444'
  };
  return colorMap[colorClass] || '#6366f1, #7c3aed';
};

export const AdminDashboard: React.FC<any> = ({ metrics, user }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Handle loading state
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3">Loading metrics...</span>
      </div>
    );
  }

  // Safe data extraction with fallbacks
  const occupancyRate = metrics.occupancy?.rate || 85;
  const monthlyRevenue = metrics.financial?.monthlyRevenue || 0;
  const openTasks = metrics.maintenance?.openTasks || 0;  // Changed from pending
  const emergencyTasks = metrics.maintenance?.emergency || 0;  // Changed from urgent
  const expiringLeases = metrics.leases?.expiring || 0;
  const totalSpaces = metrics.occupancy?.totalSpaces || 0;
  const occupiedSpaces = metrics.occupancy?.occupiedSpaces || 0;

  // Generate quick actions based on user role
  const getQuickActions = () => {
    const actions = [];

    // User Management (for admins)
    if (['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER'].includes(currentUser?.role || '')) {
      actions.push({
        title: 'Invite User',
        description: 'Add team members',
        icon: UserPlus,
        action: () => navigate('/users'),
        color: 'from-indigo-500 to-purple-600',
      });
    }

    // Tenant Management (for managers)
    if (['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER'].includes(currentUser?.role || '')) {
      actions.push({
        title: 'Add Tenant',
        description: 'New tenant profile',
        icon: UserCheck,
        action: () => navigate('/tenants'),
        color: 'from-green-500 to-emerald-500',
      });
    }

    // Universal actions
    actions.push(
      {
        title: 'Add Property',
        description: 'Expand portfolio',
        icon: Building2,
        action: () => navigate('/properties'),
        color: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Generate Report',
        description: 'Analytics & insights',
        icon: BarChart3,
        action: () => navigate('/reports'),
        color: 'from-orange-500 to-red-500',
      }
    );

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Good morning, {user?.firstName || 'User'}!
          </h1>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
            Here's your property portfolio overview with {totalSpaces} total units.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/properties')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={16} />
              Add Property
            </button>
            <button
              onClick={() => navigate('/reports')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Occupancy Rate */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Home size={24} color="white" />
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.5rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: '#dcfce7',
              color: '#166534',
              gap: '0.25rem'
            }}>
              <TrendingUp size={12} />
              Active
            </span>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
            {Math.round(occupancyRate)}%
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>Occupancy Rate</p>
          <div style={{ background: '#f3f4f6', borderRadius: '1rem', height: '0.5rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                height: '0.5rem',
                borderRadius: '1rem',
                width: `${occupancyRate}%`,
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            {occupiedSpaces} occupied, {totalSpaces - occupiedSpaces} vacant
          </p>
        </div>

        {/* Monthly Revenue */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <DollarSign size={24} color="white" />
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.5rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: '#dcfce7',
              color: '#166534',
              gap: '0.25rem'
            }}>
              <TrendingUp size={12} />
              +8.2%
            </span>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
            ${monthlyRevenue.toLocaleString()}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Monthly Revenue</p>
        </div>

        {/* Maintenance */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Wrench size={24} color="white" />
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.5rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: emergencyTasks > 0 ? '#fef2f2' : '#dcfce7',
              color: emergencyTasks > 0 ? '#991b1b' : '#166534'
            }}>
              {emergencyTasks > 0 ? `${emergencyTasks} emergency tasks` : 'No emergency tasks'}
            </span>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
            {openTasks}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Open Tasks</p>
        </div>

        {/* Expiring Leases */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Calendar size={24} color="white" />
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.5rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: '#fef3c7',
              color: '#92400e'
            }}>
              30 days
            </span>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
            {expiringLeases}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expiring Leases</p>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        '@media (max-width: 1024px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {/* Chart Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>
                Portfolio Overview
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Real-time property performance metrics
              </p>
            </div>
            <button
              onClick={() => navigate('/reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#6366f1',
                fontWeight: 500,
                fontSize: '0.875rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                gap: '0.25rem'
              }}
            >
              View details
              <ChevronRight size={16} />
            </button>
          </div>
          <div style={{
            height: '20rem',
            background: 'linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <BarChart3 size={64} color="#6366f1" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                ${(monthlyRevenue * 12).toLocaleString()}
              </p>
              <p style={{ color: '#6b7280' }}>Annual Revenue Projection</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recent Activity */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: '0 0 0.125rem 0' }}>
                    Portfolio occupancy at {Math.round(occupancyRate)}%
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Current status</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: '0 0 0.125rem 0' }}>
                    ${monthlyRevenue.toLocaleString()} monthly revenue
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>This month</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: '0 0 0.125rem 0' }}>
                    {openTasks} open maintenance tasks
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    {emergencyTasks} emergency, {metrics.maintenance?.high || 0} high priority
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  style={{
                    background: `linear-gradient(135deg, ${getGradientColors(action.color)})`,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <action.icon size={16} />
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{action.title}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};