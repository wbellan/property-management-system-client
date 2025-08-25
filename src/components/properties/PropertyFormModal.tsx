// src/components/properties/PropertyFormModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';
import {
    X,
    Upload,
    Image as ImageIcon,
    Trash2,
    Building2,
    MapPin,
    DollarSign,
    Home,
    FileText,
    AlertCircle,
    Check
} from 'lucide-react';

interface PropertyFormData {
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
    entityId: string;
    yearBuilt?: number;
    squareFootage?: number;
    lotSize?: number;
    images?: File[];
}

interface Entity {
    id: string;
    name: string;
}

interface PropertyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    property?: any;
    onSave: () => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
    isOpen,
    onClose,
    property,
    onSave
}) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

    const [formData, setFormData] = useState<PropertyFormData>({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        propertyType: 'RESIDENTIAL',
        description: '',
        totalSpaces: 1,
        purchasePrice: undefined,
        currentMarketValue: undefined,
        entityId: '',
        yearBuilt: undefined,
        squareFootage: undefined,
        lotSize: undefined,
        images: []
    });

    useEffect(() => {
        if (isOpen) {
            loadEntities();
            if (property) {
                populateForm(property);
            } else {
                resetForm();
            }
        }
    }, [isOpen, property]);

    const loadEntities = async () => {
        try {
            // Assuming you have an entities endpoint
            const response = await apiService.getEntities();
            setEntities(response.data || []);
        } catch (error) {
            console.error('Failed to load entities:', error);
        }
    };

    const populateForm = (propertyData: any) => {
        setFormData({
            name: propertyData.name || '',
            address: propertyData.address || '',
            city: propertyData.city || '',
            state: propertyData.state || '',
            zipCode: propertyData.zipCode || '',
            propertyType: propertyData.propertyType || 'RESIDENTIAL',
            description: propertyData.description || '',
            totalSpaces: propertyData.totalSpaces || 1,
            purchasePrice: propertyData.purchasePrice,
            currentMarketValue: propertyData.currentMarketValue,
            entityId: propertyData.entityId || '',
            yearBuilt: propertyData.yearBuilt,
            squareFootage: propertyData.squareFootage,
            lotSize: propertyData.lotSize,
            images: []
        });

        // Handle existing images if available
        if (propertyData.images && propertyData.images.length > 0) {
            setImagePreviewUrls(propertyData.images.map((img: any) => img.url || img));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            propertyType: 'RESIDENTIAL',
            description: '',
            totalSpaces: 1,
            purchasePrice: undefined,
            currentMarketValue: undefined,
            entityId: entities.length > 0 ? entities[0].id : '',
            yearBuilt: undefined,
            squareFootage: undefined,
            lotSize: undefined,
            images: []
        });
        setImageFiles([]);
        setImagePreviewUrls([]);
        setErrors({});
        setSuccess('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Price') || name.includes('Value') || ['totalSpaces', 'yearBuilt', 'squareFootage', 'lotSize'].includes(name)
                ? value === '' ? undefined : Number(value)
                : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setErrors(prev => ({
                ...prev,
                images: 'Please upload only JPEG, PNG, or WebP images'
            }));
            return;
        }

        // Validate file sizes (max 5MB each)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setErrors(prev => ({
                ...prev,
                images: 'Images must be smaller than 5MB each'
            }));
            return;
        }

        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));

        setImageFiles(prev => [...prev, ...files]);
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
        setErrors(prev => ({ ...prev, images: '' }));
    };

    const removeImage = (index: number) => {
        // Revoke URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviewUrls[index]);

        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Property name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.entityId) newErrors.entityId = 'Entity is required';
        if (formData.totalSpaces < 1) newErrors.totalSpaces = 'Must have at least 1 space';

        // ZIP code format validation
        if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid ZIP code format (12345 or 12345-6789)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        setSuccess('');

        try {
            const submitData = new FormData();

            // Append form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'images' && value !== undefined && value !== '') {
                    submitData.append(key, value.toString());
                }
            });

            // Append image files
            imageFiles.forEach((file, index) => {
                submitData.append(`images`, file);
            });

            let response;
            if (property) {
                // Update existing property
                response = await apiService.updateProperty(property.id, submitData);
            } else {
                // Create new property
                response = await apiService.createProperty(submitData);
            }

            setSuccess(property ? 'Property updated successfully!' : 'Property created successfully!');
            setTimeout(() => {
                onSave();
                onClose();
            }, 1500);

        } catch (error: any) {
            setErrors({
                form: error.message || `Failed to ${property ? 'update' : 'create'} property`
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <style>{`
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
          max-width: 800px;
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
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          max-height: calc(90vh - 140px);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-row-full {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-input, .form-select, .form-textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-error {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .image-upload-section {
          border: 2px dashed #d1d5db;
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.2s;
        }

        .image-upload-section:hover {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.02);
        }

        .upload-input {
          display: none;
        }

        .upload-button {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .upload-button:hover {
          background: #e5e7eb;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-remove {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-preview:hover .image-remove {
          opacity: 1;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-primary {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #5856eb;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .success-message {
          background: #f0fdf4;
          color: #166534;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #bbf7d0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .error-message {
          background: #fef2f2;
          color: #991b1b;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #fecaca;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .modal-header, .modal-body {
            padding: 1rem;
          }

          .image-preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                {property ? 'Edit Property' : 'Add New Property'}
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                                {property ? 'Update property information' : 'Enter property details and upload images'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b7280',
                                padding: '0.5rem',
                                borderRadius: '0.5rem'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {success && (
                            <div className="success-message">
                                <Check size={16} />
                                {success}
                            </div>
                        )}

                        {errors.form && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                {errors.form}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Building2 size={16} />
                                        Property Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter property name"
                                        required
                                    />
                                    {errors.name && <span className="form-error">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Entity *</label>
                                    <select
                                        name="entityId"
                                        className="form-select"
                                        value={formData.entityId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Entity</option>
                                        {entities.map(entity => (
                                            <option key={entity.id} value={entity.id}>
                                                {entity.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.entityId && <span className="form-error">{errors.entityId}</span>}
                                </div>

                                <div className="form-group form-row-full">
                                    <label className="form-label">
                                        <MapPin size={16} />
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="form-input"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter street address"
                                        required
                                    />
                                    {errors.address && <span className="form-error">{errors.address}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        required
                                    />
                                    {errors.city && <span className="form-error">{errors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        className="form-input"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state"
                                        required
                                    />
                                    {errors.state && <span className="form-error">{errors.state}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        className="form-input"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="12345 or 12345-6789"
                                        required
                                    />
                                    {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Home size={16} />
                                        Property Type *
                                    </label>
                                    <select
                                        name="propertyType"
                                        className="form-select"
                                        value={formData.propertyType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="RESIDENTIAL">Residential</option>
                                        <option value="COMMERCIAL">Commercial</option>
                                        <option value="MIXED_USE">Mixed Use</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Total Spaces *</label>
                                    <input
                                        type="number"
                                        name="totalSpaces"
                                        className="form-input"
                                        value={formData.totalSpaces}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                    {errors.totalSpaces && <span className="form-error">{errors.totalSpaces}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={16} />
                                        Purchase Price
                                    </label>
                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        className="form-input"
                                        value={formData.purchasePrice || ''}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Current Market Value</label>
                                    <input
                                        type="number"
                                        name="currentMarketValue"
                                        className="form-input"
                                        value={formData.currentMarketValue || ''}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Year Built</label>
                                    <input
                                        type="number"
                                        name="yearBuilt"
                                        className="form-input"
                                        value={formData.yearBuilt || ''}
                                        onChange={handleInputChange}
                                        placeholder="YYYY"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Square Footage</label>
                                    <input
                                        type="number"
                                        name="squareFootage"
                                        className="form-input"
                                        value={formData.squareFootage || ''}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Lot Size (sq ft)</label>
                                    <input
                                        type="number"
                                        name="lotSize"
                                        className="form-input"
                                        value={formData.lotSize || ''}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="form-group form-row-full">
                                    <label className="form-label">
                                        <FileText size={16} />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter property description..."
                                        rows={4}
                                    />
                                </div>

                                <div className="form-group form-row-full">
                                    <label className="form-label">
                                        <ImageIcon size={16} />
                                        Property Images
                                    </label>
                                    <div className="image-upload-section">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            className="upload-input"
                                            multiple
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleImageUpload}
                                        />
                                        <label htmlFor="image-upload" className="upload-button">
                                            <Upload size={16} />
                                            Choose Images
                                        </label>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                            Upload JPEG, PNG, or WebP images (max 5MB each)
                                        </p>
                                    </div>
                                    {errors.images && <span className="form-error">{errors.images}</span>}

                                    {imagePreviewUrls.length > 0 && (
                                        <div className="image-preview-grid">
                                            {imagePreviewUrls.map((url, index) => (
                                                <div key={index} className="image-preview">
                                                    <img src={url} alt={`Preview ${index + 1}`} />
                                                    <button
                                                        type="button"
                                                        className="image-remove"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};