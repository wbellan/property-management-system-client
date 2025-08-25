// src/pages/properties/PropertiesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';
import { PropertyFormModal } from '../../components/properties/PropertyFormModal';
import {
  Search,
  Filter,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Home,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Grid,
  List
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE';
  description: string;
  totalSpaces: number;
  purchasePrice?: number;
  currentMarketValue?: number;
  entity: {
    id: string;
    name: string;
  };
  stats?: {
    occupancyRate: number;
    monthlyRevenue: number;
    occupiedSpaces: number;
  };
  images?: Array<{
    id: string;
    url: string;
  }>;
}

export const PropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Property | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProperties();
      setProperties(response.data || []);
    } catch (error: any) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  const handleDelete = async (property: Property) => {
    if (!deleteConfirm) {
      setDeleteConfirm(property);
      return;
    }

    try {
      await apiService.deleteProperty(property.id);
      setProperties(prev => prev.filter(p => p.id !== property.id));
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Failed to delete property:', error);
      setDeleteConfirm(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL':
        return { bg: '#e0f2fe', color: '#0369a1' };
      case 'COMMERCIAL':
        return { bg: '#f0fdf4', color: '#166534' };
      case 'MIXED_USE':
        return { bg: '#fef3c7', color: '#92400e' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || property.propertyType === typeFilter;

    return matchesSearch && matchesType;
  });

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="property-card">
      <div className="property-image">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0].url} alt={property.name} />
        ) : (
          <div className="property-image-placeholder">
            <Building2 size={32} />
          </div>
        )}
        <div className="property-type-badge" style={getPropertyTypeColor(property.propertyType)}>
          {property.propertyType.replace('_', ' ')}
        </div>
      </div>

      <div className="property-content">
        <div className="property-header">
          <h3 className="property-name">{property.name}</h3>
          <div className="property-actions">
            <button
              className="action-btn"
              onClick={() => navigate(`/properties/${property.id}`)}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              className="action-btn"
              onClick={() => handleEdit(property)}
              title="Edit Property"
            >
              <Edit size={16} />
            </button>
            <button
              className="action-btn danger"
              onClick={() => handleDelete(property)}
              title="Delete Property"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="property-address">
          <MapPin size={14} />
          {property.address}, {property.city}, {property.state}
        </div>

        <div className="property-entity">
          {property.entity.name}
        </div>

        <div className="property-stats">
          <div className="stat-item">
            <Home size={14} />
            <span>{property.totalSpaces} spaces</span>
          </div>
          {property.stats && (
            <>
              <div className="stat-item">
                <Users size={14} />
                <span>{property.stats.occupancyRate}% occupied</span>
              </div>
              <div className="stat-item">
                <DollarSign size={14} />
                <span>{formatCurrency(property.stats.monthlyRevenue)}/mo</span>
              </div>
            </>
          )}
        </div>

        {property.currentMarketValue && (
          <div className="property-value">
            <TrendingUp size={14} />
            <span>Market Value: {formatCurrency(property.currentMarketValue)}</span>
          </div>
        )}
      </div>
    </div>
  );

  const PropertyListItem: React.FC<{ property: Property }> = ({ property }) => (
    <div className="property-list-item">
      <div className="property-main">
        <div className="property-image-small">
          {property.images && property.images.length > 0 ? (
            <img src={property.images[0].url} alt={property.name} />
          ) : (
            <Building2 size={20} />
          )}
        </div>
        <div className="property-details">
          <h4 className="property-name">{property.name}</h4>
          <div className="property-address">
            <MapPin size={12} />
            {property.address}, {property.city}, {property.state}
          </div>
          <div className="property-entity">{property.entity.name}</div>
        </div>
      </div>

      <div className="property-stats-list">
        <div className="stat-item">
          <span className="stat-label">Type:</span>
          <span
            className="property-type-badge small"
            style={getPropertyTypeColor(property.propertyType)}
          >
            {property.propertyType.replace('_', ' ')}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Spaces:</span>
          <span>{property.totalSpaces}</span>
        </div>
        {property.stats && (
          <>
            <div className="stat-item">
              <span className="stat-label">Occupancy:</span>
              <span>{property.stats.occupancyRate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Revenue:</span>
              <span>{formatCurrency(property.stats.monthlyRevenue)}/mo</span>
            </div>
          </>
        )}
      </div>

      <div className="property-actions">
        <button
          className="action-btn"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          <Eye size={16} />
        </button>
        <button
          className="action-btn"
          onClick={() => handleEdit(property)}
        >
          <Edit size={16} />
        </button>
        <button
          className="action-btn danger"
          onClick={() => handleDelete(property)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <style>{`
        .properties-page {
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

        .add-property-btn {
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

        .add-property-btn:hover {
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
          color: #6b7280;
        }

        .view-btn.active {
          background: #6366f1;
          color: white;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .properties-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .property-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        .property-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .property-image {
          position: relative;
          height: 200px;
          background: #f3f4f6;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          background: #f9fafb;
        }

        .property-type-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .property-type-badge.small {
          position: static;
          display: inline-flex;
        }

        .property-content {
          padding: 1.5rem;
        }

        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .property-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          flex: 1;
        }

        .property-actions {
          display: flex;
          gap: 0.25rem;
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

        .action-btn.danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .property-address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .property-entity {
          color: #9ca3af;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .property-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .property-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #059669;
          font-size: 0.875rem;
          font-weight: 500;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .property-list-item {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 2rem;
          transition: all 0.2s;
        }

        .property-list-item:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .property-main {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .property-image-small {
          width: 60px;
          height: 60px;
          border-radius: 0.5rem;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #9ca3af;
        }

        .property-image-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-details h4 {
          margin: 0 0 0.25rem 0;
          font-weight: 600;
          color: #111827;
        }

        .property-stats-list {
          display: flex;
          gap: 2rem;
          flex: 1;
        }

        .property-stats-list .stat-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.025em;
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

        .delete-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .delete-modal-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
        }

        .delete-modal h3 {
          margin: 0 0 1rem 0;
          color: #dc2626;
        }

        .delete-modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-delete {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .properties-page {
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

          .properties-grid {
            grid-template-columns: 1fr;
          }

          .property-list-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .property-stats-list {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">Manage your property portfolio</p>
          <div className="page-stats">
            <div className="stat">
              <Building2 size={16} />
              {filteredProperties.length} properties
            </div>
            <div className="stat">
              <Users size={16} />
              {filteredProperties.reduce((sum, p) => sum + (p.stats?.occupiedSpaces || 0), 0)} occupied
            </div>
            <div className="stat">
              <DollarSign size={16} />
              {formatCurrency(filteredProperties.reduce((sum, p) => sum + (p.stats?.monthlyRevenue || 0), 0))} revenue
            </div>
          </div>
        </div>
        <button className="add-property-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add Property
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
                placeholder="Search properties..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="MIXED_USE">Mixed Use</option>
            </select>
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      {filteredProperties.length === 0 ? (
        <div className="empty-state">
          <Building2 className="empty-icon" size={48} />
          <h3>No properties found</h3>
          <p>
            {properties.length === 0
              ? "Get started by adding your first property"
              : "Try adjusting your search or filter criteria"
            }
          </p>
          {properties.length === 0 && (
            <button className="add-property-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Add First Property
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'properties-grid' : 'properties-list'}>
          {filteredProperties.map(property => (
            viewMode === 'grid' ? (
              <PropertyCard key={property.id} property={property} />
            ) : (
              <PropertyListItem key={property.id} property={property} />
            )
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      <PropertyFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={() => {
          setShowAddModal(false);
          loadProperties();
        }}
      />

      {/* Edit Property Modal */}
      <PropertyFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
        onSave={() => {
          setShowEditModal(false);
          setSelectedProperty(null);
          loadProperties();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Property</h3>
            <p>
              Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"?
              This action cannot be undone and will permanently remove all associated data.
            </p>
            <div className="delete-modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};