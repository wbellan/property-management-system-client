// src/pages/properties/PropertyDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';
import { PropertyFormModal } from '../../components/properties/PropertyFormModal';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Building2,
    MapPin,
    DollarSign,
    Home,
    Calendar,
    Square,
    Ruler,
    Users,
    AlertTriangle,
    CheckCircle,
    Clock,
    MoreHorizontal,
    Image as ImageIcon,
    Plus,
    FileText,
    TrendingUp,
    Activity
} from 'lucide-react';

interface Property {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: string;
    description: string;
    totalSpaces: number;
    purchasePrice?: number;
    currentMarketValue?: number;
    yearBuilt?: number;
    squareFootage?: number;
    lotSize?: number;
    entity: {
        id: string;
        name: string;
    };
    images?: Array<{
        id: string;
        url: string;
        caption?: string;
    }>;
    spaces?: Array<{
        id: string;
        name: string;
        type: string;
        status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    }>;
    stats?: {
        occupancyRate: number;
        monthlyRevenue: number;
        maintenanceRequests: number;
        avgRent: number;
    };
}

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    propertyName: string;
    loading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    propertyName,
    loading
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                            Delete Property
                        </h2>
                    </div>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                            background: '#fef2f2',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            color: '#dc2626'
                        }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>
                                Are you sure you want to delete "{propertyName}"?
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                This action cannot be undone. All associated spaces, leases, and data will be permanently deleted.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-danger"
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete Property'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PropertyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id) {
            loadProperty();
        }
    }, [id]);

    const loadProperty = async () => {
        try {
            setLoading(true);
            console.log('loadProperty for ID', id);
            const response = await apiService.getProperty(id!);
            console.log('Property Response', response);
            console.log('Property Response Data', response.data);
            setProperty(response);
        } catch (error: any) {
            setError(error.message || 'Failed to load property details');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await apiService.deleteProperty(id!);
            navigate('/properties', {
                state: { message: 'Property deleted successfully' }
            });
        } catch (error: any) {
            setError(error.message || 'Failed to delete property');
            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return { bg: '#dcfce7', color: '#166534' };
            case 'OCCUPIED':
                return { bg: '#dbeafe', color: '#1d4ed8' };
            case 'MAINTENANCE':
                return { bg: '#fef3c7', color: '#92400e' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading property details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertTriangle size={48} className="error-icon" />
                <h2>Error Loading Property</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/properties')} className="btn-primary">
                    Back to Properties
                </button>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="error-container">
                <Building2 size={48} className="error-icon" />
                <h2>Property Not Found</h2>
                <p>The requested property could not be found.</p>
                <button onClick={() => navigate('/properties')} className="btn-primary">
                    Back to Properties
                </button>
            </div>
        );
    }

    return (
        <div className="property-details-page">
            <style>{`
        .property-details-page {
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

        .header-left {
          flex: 1;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .property-title {
          font-size: 2rem;
          font-weight: bold;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .property-subtitle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .property-type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          background: #e0e7ff;
          color: #3730a3;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #5856eb;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .btn-danger:disabled, .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.occupancy {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .stat-icon.revenue {
          background: linear-gradient(135deg, #6366f1 0%, #5856eb 100%);
        }

        .stat-icon.maintenance {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .stat-icon.rent {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
        }

        .tabs-nav {
          display: flex;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          gap: 0.5rem;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #6b7280;
        }

        .tab-btn.active {
          background: #6366f1;
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: #f3f4f6;
          color: #374151;
        }

        .content-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .info-group h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .info-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .info-value {
          color: #111827;
          font-weight: 500;
        }

        .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .image-item {
          aspect-ratio: 4/3;
          border-radius: 0.75rem;
          overflow: hidden;
          position: relative;
          border: 1px solid #e5e7eb;
        }

        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-images {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .spaces-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .space-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .space-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .space-name {
          font-weight: 600;
          color: #111827;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .space-type {
          color: #6b7280;
          font-size: 0.875rem;
          text-transform: capitalize;
        }

        .loading-container, .error-container {
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

        .error-icon {
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .modal-overlay {
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

        .modal-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-body {
          padding: 1.5rem;
        }

        @media (max-width: 768px) {
          .property-details-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
            justify-content: stretch;
          }

          .header-actions > * {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tabs-nav {
            flex-wrap: wrap;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            {/* Page Header */}
            <div className="page-header">
                <div className="header-left">
                    <button onClick={() => navigate('/properties')} className="back-button">
                        <ArrowLeft size={16} />
                        Back to Properties
                    </button>
                    <h1 className="property-title">{property.name}</h1>
                    <div className="property-subtitle">
                        <MapPin size={16} />
                        {property.address}, {property.city}, {property.state} {property.zipCode}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="property-type-badge">
                            {property.propertyType.replace('_', ' ')}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {property.entity.name}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button onClick={handleEdit} className="btn-secondary">
                        <Edit size={16} />
                        Edit
                    </button>
                    <button onClick={() => setShowDeleteModal(true)} className="btn-danger">
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {property.stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon occupancy">
                                <Users size={20} />
                            </div>
                            <div className="stat-label">Occupancy Rate</div>
                        </div>
                        <div className="stat-value">{property.stats.occupancyRate}%</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon revenue">
                                <DollarSign size={20} />
                            </div>
                            <div className="stat-label">Monthly Revenue</div>
                        </div>
                        <div className="stat-value">{formatCurrency(property.stats.monthlyRevenue)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon maintenance">
                                <Activity size={20} />
                            </div>
                            <div className="stat-label">Maintenance Requests</div>
                        </div>
                        <div className="stat-value">{property.stats.maintenanceRequests}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon rent">
                                <TrendingUp size={20} />
                            </div>
                            <div className="stat-label">Average Rent</div>
                        </div>
                        <div className="stat-value">{formatCurrency(property.stats.avgRent)}</div>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <nav className="tabs-nav">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'spaces' ? 'active' : ''}`}
                    onClick={() => setActiveTab('spaces')}
                >
                    Spaces
                </button>
                <button
                    className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
                    onClick={() => setActiveTab('images')}
                >
                    Images
                </button>
            </nav>

            {/* Tab Content */}
            <div className="content-section">
                {activeTab === 'overview' && (
                    <div className="info-grid">
                        <div className="info-group">
                            <h3>
                                <Building2 size={20} />
                                Property Details
                            </h3>
                            <div className="info-item">
                                <span className="info-label">Total Spaces</span>
                                <span className="info-value">{property.totalSpaces}</span>
                            </div>
                            {property.yearBuilt && (
                                <div className="info-item">
                                    <span className="info-label">Year Built</span>
                                    <span className="info-value">{property.yearBuilt}</span>
                                </div>
                            )}
                            {property.squareFootage && (
                                <div className="info-item">
                                    <span className="info-label">Square Footage</span>
                                    <span className="info-value">{formatNumber(property.squareFootage)} sq ft</span>
                                </div>
                            )}
                            {property.lotSize && ( // ToDo: Need to add a model property for lot size.
                                <div className="info-item">
                                    <span className="info-label">Lot Size</span>
                                    <span className="info-value">{formatNumber(property.lotSize)} sq ft</span>
                                </div>
                            )}
                        </div>
                        {/* // ToDo: Need to add a model property for more financial information */}
                        <div className="info-group">
                            <h3>
                                <DollarSign size={20} />
                                Financial Information
                            </h3>
                            {property.purchasePrice && (
                                <div className="info-item">
                                    <span className="info-label">Purchase Price</span>
                                    <span className="info-value">{formatCurrency(property.purchasePrice)}</span>
                                </div>
                            )}
                            {property.currentMarketValue && (
                                <div className="info-item">
                                    <span className="info-label">Current Market Value</span>
                                    <span className="info-value">{formatCurrency(property.currentMarketValue)}</span>
                                </div>
                            )}
                            {property.purchasePrice && property.currentMarketValue && (
                                <div className="info-item">
                                    <span className="info-label">Appreciation</span>
                                    <span className="info-value" style={{
                                        color: property.currentMarketValue > property.purchasePrice ? '#059669' : '#dc2626'
                                    }}>
                                        {formatCurrency(property.currentMarketValue - property.purchasePrice)}
                                        ({((property.currentMarketValue - property.purchasePrice) / property.purchasePrice * 100).toFixed(1)}%)
                                    </span>
                                </div>
                            )}
                        </div>

                        {property.description && (
                            <div className="info-group" style={{ gridColumn: '1 / -1' }}>
                                <h3>
                                    <FileText size={20} />
                                    Description
                                </h3>
                                <p style={{ color: '#374151', lineHeight: '1.6', margin: 0 }}>
                                    {property.description}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'spaces' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Property Spaces</h3>
                            <button className="btn-primary">
                                <Plus size={16} />
                                Add Space
                            </button>
                        </div>
                        {property.spaces && property.spaces.length > 0 ? (
                            <div className="spaces-grid">
                                {property.spaces.map(space => (
                                    <div key={space.id} className="space-card">
                                        <div className="space-header">
                                            <span className="space-name">{space.name}</span>
                                            <span
                                                className="status-badge"
                                                style={getStatusColor(space.status)}
                                            >
                                                {space.status}
                                            </span>
                                        </div>
                                        <div className="space-type">{space.type}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-images">
                                <Home size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                                <p>No spaces defined for this property</p>
                                <button className="btn-primary">
                                    <Plus size={16} />
                                    Add First Space
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'images' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Property Images</h3>
                            <button className="btn-primary">
                                <Plus size={16} />
                                Upload Images
                            </button>
                        </div>
                        {property.images && property.images.length > 0 ? (
                            <div className="image-gallery">
                                {property.images.map(image => (
                                    <div key={image.id} className="image-item">
                                        <img src={image.url} alt={image.caption || property.name} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-images">
                                <ImageIcon size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                                <p>No images uploaded for this property</p>
                                <button className="btn-primary">
                                    <Plus size={16} />
                                    Upload First Image
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <PropertyFormModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                property={property}
                onSave={() => {
                    setShowEditModal(false);
                    loadProperty();
                }}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                propertyName={property.name}
                loading={deleteLoading}
            />
        </div>
    );
};