import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Edit,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface Lease {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'active' | 'expiring' | 'expired' | 'renewed';
  autoRenew: boolean;
  lastPayment: string;
  nextPaymentDue: string;
  totalPaid: number;
  balanceDue: number;
  leaseType: 'residential' | 'commercial';
  documents: string[];
}

interface LeasesContentProps {
  leases: Lease[];
  loading: boolean;
  onRefresh: () => void;
}

export const LeasesContent: React.FC<LeasesContentProps> = ({ 
  leases, 
  loading, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = 
      lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lease.status === statusFilter;
    const matchesType = typeFilter === 'all' || lease.leaseType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'lease-status-active';
      case 'expiring': return 'lease-status-expiring';
      case 'expired': return 'lease-status-expired';
      case 'renewed': return 'lease-status-renewed';
      default: return 'lease-status-active';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'expiring': return <AlertTriangle size={16} />;
      case 'expired': return <AlertCircle size={16} />;
      case 'renewed': return <RefreshCw size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const LeaseCard: React.FC<{ lease: Lease }> = ({ lease }) => {
    const daysUntilExpiry = getDaysUntilExpiry(lease.endDate);
    
    return (
      <div className="lease-card">
        <div className="lease-card-header">
          <div className="lease-info">
            <div className="lease-icon">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="lease-tenant">{lease.tenantName}</h3>
              <p className="lease-property">{lease.propertyName} - {lease.unitNumber}</p>
              <span className="lease-type">{lease.leaseType}</span>
            </div>
          </div>
          <div className="lease-status-container">
            <span className={`lease-status ${getStatusColor(lease.status)}`}>
              {getStatusIcon(lease.status)}
              {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
            </span>
            {lease.status === 'expiring' && daysUntilExpiry > 0 && (
              <span className="expiry-warning">
                {daysUntilExpiry} days left
              </span>
            )}
          </div>
        </div>

        <div className="lease-details">
          <div className="lease-detail-row">
            <div className="lease-detail">
              <Calendar size={16} />
              <div>
                <span className="detail-label">Lease Term</span>
                <span className="detail-value">{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</span>
              </div>
            </div>
          </div>

          <div className="lease-detail-row">
            <div className="lease-detail">
              <DollarSign size={16} />
              <div>
                <span className="detail-label">Monthly Rent</span>
                <span className="detail-value">${lease.monthlyRent.toLocaleString()}</span>
              </div>
            </div>
            <div className="lease-detail">
              <div className="auto-renew-indicator">
                {lease.autoRenew ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertCircle size={16} className="text-orange-500" />
                )}
              </div>
              <div>
                <span className="detail-label">Auto Renew</span>
                <span className="detail-value">{lease.autoRenew ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="lease-detail-row">
            <div className="lease-detail">
              <Clock size={16} />
              <div>
                <span className="detail-label">Next Payment Due</span>
                <span className="detail-value">{formatDate(lease.nextPaymentDue)}</span>
              </div>
            </div>
            {lease.balanceDue > 0 && (
              <div className="lease-detail balance-due">
                <AlertCircle size={16} />
                <div>
                  <span className="detail-label">Balance Due</span>
                  <span className="detail-value text-red-600">${lease.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="lease-financial-summary">
            <div className="financial-item">
              <span className="financial-label">Total Paid</span>
              <span className="financial-value">${lease.totalPaid.toLocaleString()}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Security Deposit</span>
              <span className="financial-value">${lease.securityDeposit.toLocaleString()}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Documents</span>
              <span className="financial-value">{lease.documents.length} files</span>
            </div>
          </div>
        </div>

        <div className="lease-card-footer">
          <button className="lease-action-btn">
            <Eye size={16} />
            View
          </button>
          <button className="lease-action-btn">
            <Edit size={16} />
            Edit
          </button>
          <button className="lease-action-btn">
            <Download size={16} />
            Documents
          </button>
          {lease.status === 'expiring' && (
            <button className="lease-action-btn lease-action-primary">
              <RefreshCw size={16} />
              Renew
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="leases-loading">
        <div className="loading-spinner"></div>
        <p>Loading leases...</p>
      </div>
    );
  }

  return (
    <div className="leases-container">
      <div className="leases-header">
        <div>
          <h1 className="leases-title">Lease Management</h1>
          <p className="leases-subtitle">Monitor lease agreements, renewals, and payments</p>
        </div>
        <div className="leases-actions">
          <button className="btn btn-secondary">
            <Filter size={16} />
            Advanced Filter
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            New Lease
          </button>
        </div>
      </div>

      <div className="leases-toolbar">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search leases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
              <option value="renewed">Renewed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Type:</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="leases-count">
          {filteredLeases.length} {filteredLeases.length === 1 ? 'lease' : 'leases'}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="lease-stats">
        <div className="stat-item">
          <div className="stat-icon stat-icon-green">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="stat-number">{leases.filter(l => l.status === 'active').length}</div>
            <div className="stat-label">Active Leases</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-icon-orange">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="stat-number">{leases.filter(l => l.status === 'expiring').length}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-icon-blue">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="stat-number">${leases.reduce((sum, l) => sum + l.monthlyRent, 0).toLocaleString()}</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-icon-red">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="stat-number">${leases.reduce((sum, l) => sum + l.balanceDue, 0).toLocaleString()}</div>
            <div className="stat-label">Outstanding Balance</div>
          </div>
        </div>
      </div>

      {filteredLeases.length === 0 ? (
        <div className="leases-empty">
          <FileText size={64} className="empty-icon" />
          <h3 className="empty-title">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? 'No leases found' : 'No leases yet'}
          </h3>
          <p className="empty-subtitle">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first lease agreement.'}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <button className="btn btn-primary">
              <Plus size={16} />
              Create Your First Lease
            </button>
          )}
        </div>
      ) : (
        <div className="leases-grid">
          {filteredLeases.map((lease) => (
            <LeaseCard key={lease.id} lease={lease} />
          ))}
        </div>
      )}
    </div>
  );
};
