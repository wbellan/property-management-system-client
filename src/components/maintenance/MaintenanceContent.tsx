import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  Calendar, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  FileText,
  Camera,
  Edit,
  Eye,
  AlertTriangle,
  Zap,
  Droplets,
  Wind,
  Cpu,
  Home
} from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'completed' | 'on-hold';
  createdDate: string;
  assignedTo?: string;
  estimatedCost: number;
  actualCost?: number;
  dueDate: string;
  completedDate?: string;
  images: string[];
  notes: string[];
}

interface MaintenanceContentProps {
  requests: MaintenanceRequest[];
  loading: boolean;
  onRefresh: () => void;
}

export const MaintenanceContent: React.FC<MaintenanceContentProps> = ({ 
  requests, 
  loading, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'maintenance-status-open';
      case 'in-progress': return 'maintenance-status-in-progress';
      case 'completed': return 'maintenance-status-completed';
      case 'on-hold': return 'maintenance-status-on-hold';
      default: return 'maintenance-status-open';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      default: return 'priority-medium';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing': return <Droplets size={16} />;
      case 'electrical': return <Zap size={16} />;
      case 'hvac': return <Wind size={16} />;
      case 'appliance': return <Cpu size={16} />;
      case 'general': return <Home size={16} />;
      case 'emergency': return <AlertTriangle size={16} />;
      default: return <Wrench size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysOverdue = (dueDate: string, status: string) => {
    if (status === 'completed') return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const MaintenanceCard: React.FC<{ request: MaintenanceRequest }> = ({ request }) => {
    const daysOverdue = getDaysOverdue(request.dueDate, request.status);
    
    return (
      <div className="maintenance-card">
        <div className="maintenance-card-header">
          <div className="maintenance-info">
            <div className="maintenance-icon">
              {getCategoryIcon(request.category)}
            </div>
            <div>
              <h3 className="maintenance-title">{request.title}</h3>
              <p className="maintenance-location">
                <MapPin size={14} />
                {request.propertyName} - {request.unitNumber}
              </p>
              <p className="maintenance-tenant">Tenant: {request.tenantName}</p>
            </div>
          </div>
          <div className="maintenance-badges">
            <span className={`maintenance-status ${getStatusColor(request.status)}`}>
              {request.status === 'open' && <AlertCircle size={14} />}
              {request.status === 'in-progress' && <Clock size={14} />}
              {request.status === 'completed' && <CheckCircle size={14} />}
              {request.status === 'on-hold' && <AlertTriangle size={14} />}
              {request.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`maintenance-priority ${getPriorityColor(request.priority)}`}>
              {request.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="maintenance-description">
          <p>{request.description}</p>
        </div>

        <div className="maintenance-details">
          <div className="detail-row">
            <div className="detail-item">
              <Calendar size={16} />
              <div>
                <span className="detail-label">Created</span>
                <span className="detail-value">{formatDate(request.createdDate)}</span>
              </div>
            </div>
            <div className="detail-item">
              <Calendar size={16} />
              <div>
                <span className="detail-label">Due Date</span>
                <span className={`detail-value ${daysOverdue > 0 ? 'overdue' : ''}`}>
                  {formatDate(request.dueDate)}
                  {daysOverdue > 0 && <span className="overdue-text">({daysOverdue} days overdue)</span>}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-item">
              <DollarSign size={16} />
              <div>
                <span className="detail-label">Estimated Cost</span>
                <span className="detail-value">${request.estimatedCost}</span>
              </div>
            </div>
            {request.actualCost && (
              <div className="detail-item">
                <DollarSign size={16} />
                <div>
                  <span className="detail-label">Actual Cost</span>
                  <span className="detail-value">${request.actualCost}</span>
                </div>
              </div>
            )}
          </div>

          {request.assignedTo && (
            <div className="detail-row">
              <div className="detail-item">
                <User size={16} />
                <div>
                  <span className="detail-label">Assigned To</span>
                  <span className="detail-value">{request.assignedTo}</span>
                </div>
              </div>
            </div>
          )}

          {request.completedDate && (
            <div className="detail-row">
              <div className="detail-item">
                <CheckCircle size={16} />
                <div>
                  <span className="detail-label">Completed</span>
                  <span className="detail-value">{formatDate(request.completedDate)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="maintenance-meta">
          <div className="meta-item">
            <Camera size={16} />
            <span>{request.images.length} photos</span>
          </div>
          <div className="meta-item">
            <FileText size={16} />
            <span>{request.notes.length} notes</span>
          </div>
        </div>

        <div className="maintenance-card-footer">
          <button className="maintenance-action-btn">
            <Eye size={16} />
            View
          </button>
          <button className="maintenance-action-btn">
            <Edit size={16} />
            Edit
          </button>
          {request.status === 'open' && (
            <button className="maintenance-action-btn maintenance-action-primary">
              <User size={16} />
              Assign
            </button>
          )}
          {request.status === 'in-progress' && (
            <button className="maintenance-action-btn maintenance-action-success">
              <CheckCircle size={16} />
              Complete
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="maintenance-loading">
        <div className="loading-spinner"></div>
        <p>Loading maintenance requests...</p>
      </div>
    );
  }

  return (
    <div className="maintenance-container">
      <div className="maintenance-header">
        <div>
          <h1 className="maintenance-title">Maintenance Management</h1>
          <p className="maintenance-subtitle">Track work orders, assignments, and completion status</p>
        </div>
        <div className="maintenance-actions">
          <button className="btn btn-secondary">
            <Filter size={16} />
            Advanced Filter
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            New Request
          </button>
        </div>
      </div>

      <div className="maintenance-toolbar">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search maintenance requests..."
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
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Priority:</label>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category:</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="appliance">Appliance</option>
              <option value="general">General</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="maintenance-count">
          {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="maintenance-stats">
        <div className="stat-item">
          <div className="stat-icon stat-icon-red">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="stat-number">{requests.filter(r => r.status === 'open').length}</div>
            <div className="stat-label">Open Requests</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-icon-blue">
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-number">{requests.filter(r => r.status === 'in-progress').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-icon-orange">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="stat-number">{requests.filter(r => r.priority === 'urgent' && r.status !== 'completed').length}</div>
            <div className="stat-label">Urgent Priority</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon stat-icon-green">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="stat-number">${requests.filter(r => r.actualCost).reduce((sum, r) => sum + (r.actualCost || 0), 0).toLocaleString()}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="maintenance-empty">
          <Wrench size={64} className="empty-icon" />
          <h3 className="empty-title">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' 
              ? 'No maintenance requests found' 
              : 'No maintenance requests yet'}
          </h3>
          <p className="empty-subtitle">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first maintenance request.'}
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && categoryFilter === 'all' && (
            <button className="btn btn-primary">
              <Plus size={16} />
              Create First Request
            </button>
          )}
        </div>
      ) : (
        <div className="maintenance-grid">
          {filteredRequests.map((request) => (
            <MaintenanceCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};
