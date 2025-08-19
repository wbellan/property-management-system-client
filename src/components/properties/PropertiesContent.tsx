import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: string;
  totalUnits?: number;
  spaces?: any[];
  entityId: string;
  createdAt: string;
  updatedAt: string;
}

interface PropertiesContentProps {
  properties: Property[];
  loading: boolean;
  onRefresh: () => void;
}

export const PropertiesContent: React.FC<PropertiesContentProps> = ({ 
  properties, 
  loading, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="property-card">
      <div className="property-card-header">
        <div className="property-info">
          <div className="property-icon">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="property-name">{property.name}</h3>
            <p className="property-address">
              <MapPin size={16} />
              {property.address}
            </p>
          </div>
        </div>
        <div className="property-actions">
          <button className="property-action-btn">
            <Eye size={16} />
          </button>
          <button className="property-action-btn">
            <Edit size={16} />
          </button>
          <button className="property-action-btn property-action-danger">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="property-details">
        <div className="property-detail">
          <span className="property-detail-label">Property Type</span>
          <span className="property-detail-value">{property.propertyType}</span>
        </div>
        <div className="property-detail">
          <span className="property-detail-label">Units</span>
          <span className="property-detail-value">{property.totalUnits || 'N/A'}</span>
        </div>
      </div>

      <div className="property-card-footer">
        <span className="property-status property-status-active">
          Active
        </span>
        <button className="property-view-btn">
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="properties-loading">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="properties-container">
      <div className="properties-header">
        <div>
          <h1 className="properties-title">Properties</h1>
          <p className="properties-subtitle">Manage your property portfolio</p>
        </div>
        <div className="properties-actions">
          <button className="btn btn-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      <div className="properties-toolbar">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="properties-count">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="properties-empty">
          <Building2 size={64} className="empty-icon" />
          <h3 className="empty-title">
            {searchTerm ? 'No properties found' : 'No properties yet'}
          </h3>
          <p className="empty-subtitle">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by adding your first property to the system.'}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Add Your First Property
            </button>
          )}
        </div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};
