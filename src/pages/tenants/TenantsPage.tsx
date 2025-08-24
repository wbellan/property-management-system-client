// src/pages/tenants/TenantsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  Filter,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  Home,
  FileText
} from 'lucide-react';

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  lease?: {
    id: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    property: {
      name: string;
      address: string;
    };
    space: {
      name: string;
    };
  };
  balance: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export const TenantsPage: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTenants: Tenant[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        status: 'ACTIVE',
        balance: 0,
        lease: {
          id: 'lease-1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 1200,
          property: {
            name: 'Sunset Apartments',
            address: '123 Main St'
          },
          space: {
            name: 'Unit 2A'
          }
        },
        emergencyContact: {
          name: 'Jane Smith',
          phone: '(555) 987-6543',
          relationship: 'Spouse'
        }
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 234-5678',
        status: 'ACTIVE',
        balance: -150,
        lease: {
          id: 'lease-2',
          startDate: '2024-03-01',
          endDate: '2025-02-28',
          monthlyRent: 1350,
          property: {
            name: 'Oak View Complex',
            address: '456 Oak Avenue'
          },
          space: {
            name: 'Unit 1B'
          }
        },
        emergencyContact: {
          name: 'Mike Johnson',
          phone: '(555) 876-5432',
          relationship: 'Brother'
        }
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Davis',
        email: 'michael.davis@email.com',
        phone: '(555) 345-6789',
        status: 'PENDING',
        balance: 0,
        lease: {
          id: 'lease-3',
          startDate: '2024-09-01',
          endDate: '2025-08-31',
          monthlyRent: 1100,
          property: {
            name: 'Pine Ridge Homes',
            address: '789 Pine Street'
          },
          space: {
            name: 'Unit 3C'
          }
        }
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Wilson',
        email: 'emily.wilson@email.com',
        phone: '(555) 456-7890',
        status: 'INACTIVE',
        balance: 500,
        emergencyContact: {
          name: 'Tom Wilson',
          phone: '(555) 765-4321',
          relationship: 'Father'
        }
      }
    ];

    setTimeout(() => {
      setTenants(mockTenants);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch =
      tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: '#dcfce7', color: '#166534' };
      case 'PENDING':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'INACTIVE':
        return { bg: '#fef2f2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return { bg: '#fef2f2', color: '#991b1b' };
    if (balance > 0) return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#dcfce7', color: '#166534' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tenants...</p>
      </div>
    );
  }

  return (
    <div className="tenants-page">
      <style>{`
        .tenants-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .page-subtitle {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .page-stats {
          display: flex;
          gap: 2rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-tenant-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .add-tenant-btn:hover {
          background: #5856eb;
          transform: translateY(-1px);
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .filters-left {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
        }

        .view-toggle {
          display: flex;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .view-btn {
          background: white;
          border: none;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: #6366f1;
          color: white;
        }

        .tenants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .tenant-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        .tenant-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .tenant-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .tenant-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.125rem;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .tenant-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .tenant-contact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .lease-info {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .lease-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .lease-details {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .balance-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .balance-label {
          font-weight: 500;
          color: #374151;
        }

        .balance-amount {
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .action-btn {
          background: #f3f4f6;
          border: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .empty-icon {
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .tenants-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .filters-left {
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .tenants-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tenants</h1>
          <p className="page-subtitle">Manage tenant information and leases</p>
          <div className="page-stats">
            <div className="stat">
              <CheckCircle size={16} />
              {filteredTenants.filter(t => t.status === 'ACTIVE').length} Active
            </div>
            <div className="stat">
              <Clock size={16} />
              {filteredTenants.filter(t => t.status === 'PENDING').length} Pending
            </div>
            <div className="stat">
              <AlertTriangle size={16} />
              {filteredTenants.filter(t => t.balance < 0).length} Past Due
            </div>
          </div>
        </div>
        <button className="add-tenant-btn">
          <Plus size={16} />
          Add Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filters-left">
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search tenants..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      {filteredTenants.length === 0 ? (
        <div className="empty-state">
          <User className="empty-icon" size={48} />
          <h3>No tenants found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="tenants-grid">
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className="tenant-card">
              <div className="tenant-header">
                <div>
                  <div className="tenant-avatar">
                    {tenant.firstName[0]}{tenant.lastName[0]}
                  </div>
                  <div className="tenant-name">
                    {tenant.firstName} {tenant.lastName}
                  </div>
                </div>
                <span
                  className="status-badge"
                  style={getStatusColor(tenant.status)}
                >
                  {tenant.status}
                </span>
              </div>

              <div className="tenant-contact">
                <div className="contact-item">
                  <Mail size={14} />
                  {tenant.email}
                </div>
                <div className="contact-item">
                  <Phone size={14} />
                  {tenant.phone}
                </div>
              </div>

              {tenant.lease && (
                <div className="lease-info">
                  <div className="lease-header">
                    <Home size={16} />
                    Current Lease
                  </div>
                  <div className="lease-details">
                    <div>{tenant.lease.property.name} - {tenant.lease.space.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span>{formatCurrency(tenant.lease.monthlyRent)}/month</span>
                      <span>Expires {formatDate(tenant.lease.endDate)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="balance-section">
                <span className="balance-label">Balance:</span>
                <span
                  className="balance-amount"
                  style={getBalanceColor(tenant.balance)}
                >
                  {formatCurrency(Math.abs(tenant.balance))}
                  {tenant.balance < 0 ? ' overdue' : tenant.balance > 0 ? ' credit' : ' current'}
                </span>
              </div>

              <div className="card-actions">
                <button className="action-btn">
                  <Eye size={16} />
                </button>
                <button className="action-btn">
                  <Edit size={16} />
                </button>
                <button className="action-btn">
                  <FileText size={16} />
                </button>
                <button className="action-btn">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};