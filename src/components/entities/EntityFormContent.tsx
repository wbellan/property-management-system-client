// src/components/entities/EntityFormContent.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Entity, CreateEntityDto, UpdateEntityDto } from '../../types/entity';
import { entitiesService } from '../../services/api/entitiesService';

export interface EntityFormContentProps {
    entity: Entity | null;
    mode: 'create' | 'edit';
    onSave: (data: CreateEntityDto | UpdateEntityDto) => void;
    onCancel: () => void;
}

export const EntityFormContent: React.FC<EntityFormContentProps> = ({
    entity,
    mode,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        name: '',
        legalName: '',
        entityType: 'LLC',
        organizationId: 'org-1', // This would come from current user context
        address: '',
        phone: '',
        email: '',
        fax: '',
        website: '',
        taxId: '',
        description: '',
        isActive: true
    });

    const [einVerification, setEinVerification] = useState({
        isVerifying: false,
        isVerified: false,
        verificationResult: null,
        error: null
    });

    useEffect(() => {
        if (entity && mode === 'edit') {
            setFormData({
                name: entity.name || '',
                legalName: entity.legalName || '',
                entityType: entity.entityType || 'LLC',
                organizationId: entity.organizationId || 'org-1',
                address: entity.address || '',
                phone: entity.phone || '',
                email: entity.email || '',
                fax: entity.fax || '',
                website: entity.website || '',
                taxId: entity.taxId || '',
                description: entity.description || '',
                isActive: entity.isActive !== undefined ? entity.isActive : true
            });

            // Set verification status if entity is already verified
            if (entity.isVerified) {
                setEinVerification(prev => ({
                    ...prev,
                    isVerified: true
                }));
            }
        }
    }, [entity, mode]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Reset verification status if Tax ID changes
        if (field === 'taxId') {
            setEinVerification({
                isVerifying: false,
                isVerified: false,
                verificationResult: null,
                error: null
            });
        }
    };

    const handleVerifyEIN = async () => {
        if (!formData.taxId) {
            setEinVerification(prev => ({
                ...prev,
                error: 'Please enter a Tax ID/EIN first'
            }));
            return;
        }

        setEinVerification(prev => ({
            ...prev,
            isVerifying: true,
            error: null
        }));

        try {
            const response = await entitiesService.verifyEIN(formData.taxId);

            if (response.success && response.data?.isValid) {
                setEinVerification({
                    isVerifying: false,
                    isVerified: true,
                    verificationResult: response.data,
                    error: null
                });
            } else {
                setEinVerification({
                    isVerifying: false,
                    isVerified: false,
                    verificationResult: response.data,
                    error: response.data?.message || 'EIN verification failed'
                });
            }
        } catch (error) {
            setEinVerification({
                isVerifying: false,
                isVerified: false,
                verificationResult: null,
                error: 'Failed to verify EIN. Please try again.'
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const formatEIN = (value: string) => {
        // Remove all non-digits
        const digitsOnly = value.replace(/\D/g, '');

        // Format as XX-XXXXXXX
        if (digitsOnly.length >= 2) {
            return digitsOnly.substring(0, 2) + '-' + digitsOnly.substring(2, 9);
        }
        return digitsOnly;
    };

    const handleEINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatEIN(e.target.value);
        handleInputChange('taxId', formatted);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ padding: '1.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Basic Information */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '1rem'
                        }}>
                            Basic Information
                        </h3>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Entity Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="Enter entity name"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Legal Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.legalName}
                            onChange={(e) => handleInputChange('legalName', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="Enter legal name"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Entity Type *
                        </label>
                        <select
                            required
                            value={formData.entityType}
                            onChange={(e) => handleInputChange('entityType', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            <option value="LLC">LLC</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                            <option value="Trust">Trust</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Tax ID with Verification */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Tax ID / EIN
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={formData.taxId}
                                onChange={handleEINChange}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                                placeholder="XX-XXXXXXX"
                                maxLength={10}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyEIN}
                                disabled={!formData.taxId || einVerification.isVerifying}
                                style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: einVerification.isVerified ? '#10b981' : '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    opacity: (!formData.taxId || einVerification.isVerifying) ? 0.6 : 1
                                }}
                            >
                                {einVerification.isVerifying ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Verifying...
                                    </>
                                ) : einVerification.isVerified ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Verified
                                    </>
                                ) : (
                                    'Verify EIN'
                                )}
                            </button>
                        </div>

                        {/* Verification Status Messages */}
                        {einVerification.error && (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <XCircle size={16} style={{ color: '#dc2626' }} />
                                <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>
                                    {einVerification.error}
                                </span>
                            </div>
                        )}

                        {einVerification.isVerified && einVerification.verificationResult && (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '0.5rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <CheckCircle size={16} style={{ color: '#16a34a' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '600' }}>
                                        EIN Verified Successfully
                                    </span>
                                </div>

                                {einVerification.verificationResult.businessName && (
                                    <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                                        <strong>Business Name:</strong> {einVerification.verificationResult.businessName}
                                    </div>
                                )}

                                {einVerification.verificationResult.businessType && (
                                    <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                                        <strong>Business Type:</strong> {einVerification.verificationResult.businessType}
                                    </div>
                                )}

                                {einVerification.verificationResult.status && (
                                    <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        <strong>Status:</strong> {einVerification.verificationResult.status}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                resize: 'vertical'
                            }}
                            placeholder="Brief description of the entity..."
                        />
                    </div>

                    {/* Contact Information */}
                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '1rem'
                        }}>
                            Contact Information
                        </h3>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Address
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="Street address, city, state, zip"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="contact@entity.com"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Fax
                        </label>
                        <input
                            type="tel"
                            value={formData.fax}
                            onChange={(e) => handleInputChange('fax', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="+1 (555) 123-4568"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Website
                        </label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            placeholder="https://www.entity.com"
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            Entity is Active
                        </label>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: '1.5rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
            }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    {mode === 'create' ? 'Create Entity' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};