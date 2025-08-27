// src/components/entities/EntityCard.tsx
import React from 'react';
import { Eye, Edit3, Trash2, MapPin, Phone, Mail, CheckCircle, AlertCircle, BarChart3, Shield } from 'lucide-react';
import type { Entity } from '../../types/entity';

export interface EntityCardProps {
    entity: Entity;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const EntityCard: React.FC<EntityCardProps> = ({ entity, onView, onEdit, onDelete }) => {
    return (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #f3f4f6',
                transition: 'all 0.2s',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
            }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0 0 0.5rem 0'
                    }}>
                        {entity.name}
                    </h3>

                    {/* Status Badges Row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        {/* Active/Inactive Badge */}
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: entity.isActive ? '#dcfce7' : '#fee2e2',
                            color: entity.isActive ? '#166534' : '#991b1b'
                        }}>
                            {entity.isActive ? (
                                <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
                            ) : (
                                <AlertCircle size={12} style={{ marginRight: '0.25rem' }} />
                            )}
                            {entity.isActive ? 'Active' : 'Inactive'}
                        </span>

                        {/* EIN Verification Badge - Only show if taxId exists */}
                        {entity.taxId && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                backgroundColor: entity.isVerified ? '#dbeafe' : '#fef3c7',
                                color: entity.isVerified ? '#1e40af' : '#92400e'
                            }}>
                                <Shield size={12} style={{ marginRight: '0.25rem' }} />
                                {entity.isVerified ? 'EIN Verified' : 'EIN Pending'}
                            </span>
                        )}
                    </div>

                    <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        margin: 0
                    }}>
                        {/* {entity.entityType} • {entity.organization.name} */}
                         Managed By {entity.organization.name}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView();
                        }}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Edit Entity"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Delete Entity"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Legal Name */}
            <div style={{ marginBottom: '1rem' }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    margin: '0 0 0.5rem 0',
                    fontWeight: '500'
                }}>
                    {entity.legalName}
                </p>

                {entity.description && (
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        margin: '0 0 1rem 0',
                        lineHeight: '1.4'
                    }}>
                        {entity.description.length > 120
                            ? entity.description.substring(0, 120) + '...'
                            : entity.description
                        }
                    </p>
                )}

                {/* Contact Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {entity.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {entity.address}
                            </span>
                        </div>
                    )}

                    {entity.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {entity.phone}
                            </span>
                        </div>
                    )}

                    {entity.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {entity.email}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '0.25rem'
                    }}>
                        {entity._count.properties}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Properties</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '0.25rem'
                    }}>
                        {entity._count.bankLedgers}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Bank Accounts</div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Created {new Date(entity.createdAt).toLocaleDateString()}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView();
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    <BarChart3 size={14} />
                    View Details
                </button>
            </div>
        </div>
    );
};