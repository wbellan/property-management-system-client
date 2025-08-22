import React, { useState } from 'react';
import { Wrench, Plus, Search, Filter, Calendar, DollarSign, User, Clock, AlertCircle, CheckCircle, PlayCircle, PauseCircle } from 'lucide-react';

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
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  if (loading) {
    return (
      <div className="maintenance-loading">
        <div className="loading-spinner"></div>
        <p>Loading maintenance requests...</p>
      </div>
    );
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || request.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in-progress': return PlayCircle;
      case 'completed': return CheckCircle;
      case 'on-hold': return PauseCircle;
      default: return AlertCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      plumbing: 'from-blue-500 to-cyan-500',
      electrical: 'from-yellow-500 to-orange-500',
      hvac: 'from-green-500 to-emerald-500',
      appliance: 'from-purple-500 to-pink-500',
      general: 'from-gray-500 to-gray-600',
      emergency: 'from-red-500 to-pink-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getOverdueStatus = (dueDate: string, status: string) => {
    if (status === 'completed') return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  // Calculate statistics
  const stats = {
    total: requests.length,
    open: requests.filter(r => r.status === 'open').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    urgent: requests.filter(r => r.priority === 'urgent').length
  };

  return (
    <div className="maintenance-container">
      {/* Header with proper title styling to match other pages */}
      <div className="maintenance-header">
        <div>
          <h1 className="properties-title">Maintenance Management</h1>
          <p className="properties-subtitle">Track work orders, assignments, and completion status</p>
        </div>
        <div className="maintenance-actions">
          <button className="btn btn-secondary">
            <Filter style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Filter
          </button>
          <button className="btn btn-primary">
            <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            New Request
          </button>
        </div>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="maintenance-toolbar">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search requests by title, property, or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
            <label className="filter-label">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <span className="maintenance-count">
          {filteredRequests.length} of {requests.length} requests
        </span>
      </div>

      {/* Statistics */}
      <div className="maintenance-stats">
        <div className="stat-item">
          <div className="stat-icon stat-icon-blue">
            <Wrench size={20} />
          </div>
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon stat-icon-red">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="stat-number">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon stat-icon-blue">
            <PlayCircle size={20} />
          </div>
          <div>
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon stat-icon-green">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Maintenance Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="maintenance-empty">
          <Wrench className="empty-icon" size={64} />
          <h3 className="empty-title">No maintenance requests found</h3>
          <p className="empty-subtitle">
            {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all'
              ? 'Try adjusting your search filters or create a new request.'
              : 'Create your first maintenance request to get started.'
            }
          </p>
          <button className="btn btn-primary">
            <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            New Request
          </button>
        </div>
      ) : (
        <div className="maintenance-grid">
          {filteredRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            const isOverdue = getOverdueStatus(request.dueDate, request.status);

            return (
              <div key={request.id} className="maintenance-card">
                <div className="maintenance-card-header">
                  <div className="maintenance-info">
                    <div className={`maintenance-icon bg-gradient-to-r ${getCategoryColor(request.category)}`}>
                      <Wrench size={20} />
                    </div>
                    <div>
                      <h3 className="maintenance-title">{request.title}</h3>
                      <div className="maintenance-location">
                        <span>{request.propertyName}</span>
                        {request.unitNumber && <span> • {request.unitNumber}</span>}
                      </div>
                      <div className="maintenance-tenant">
                        Requested by: {request.tenantName}
                      </div>
                    </div>
                  </div>

                  <div className="maintenance-badges">
                    <span className={`maintenance-status maintenance-status-${request.status}`}>
                      <StatusIcon size={12} />
                      {request.status.replace('-', ' ')}
                    </span>
                    <span className={`maintenance-priority priority-${request.priority}`}>
                      {request.priority}
                    </span>
                  </div>
                </div>

                <div className="maintenance-description">
                  {request.description}
                </div>

                <div className="maintenance-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <div>
                        <span className="detail-label">Due Date</span>
                        <span className={`detail-value ${isOverdue ? 'overdue' : ''}`}>
                          {new Date(request.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="overdue-text">Overdue</span>}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <DollarSign size={16} />
                      <div>
                        <span className="detail-label">Estimated Cost</span>
                        <span className="detail-value">${request.estimatedCost}</span>
                      </div>
                    </div>
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
                </div>

                <div className="maintenance-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Created {new Date(request.createdDate).toLocaleDateString()}</span>
                  </div>

                  {request.images.length > 0 && (
                    <div className="meta-item">
                      <span>{request.images.length} photo{request.images.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {request.notes.length > 0 && (
                    <div className="meta-item">
                      <span>{request.notes.length} note{request.notes.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="maintenance-card-footer">
                  <button className="maintenance-action-btn">
                    View Details
                  </button>

                  {request.status === 'open' && (
                    <button className="maintenance-action-btn maintenance-action-primary">
                      Assign
                    </button>
                  )}

                  {request.status === 'in-progress' && (
                    <button className="maintenance-action-btn maintenance-action-success">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};