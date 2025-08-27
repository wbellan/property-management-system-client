import React from 'react';
import { Home, Users, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import type { Entity, EntityStats } from '../../types/entity';

export interface EntityViewContentProps {
    entity: Entity | null;
    entityStats: EntityStats | null;
}

export const EntityViewContent: React.FC<EntityViewContentProps> = ({ entity, entityStats }) => {
    if (!entity) return null;

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: entityStats ? 'repeat(2, 1fr)' : '1fr',
                gap: '2rem'
            }}>
                {/* Entity Details */}
                <div>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '1rem'
                    }}>
                        Basic Information
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                Entity Name
                            </label>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.name}</p>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                Legal Name
                            </label>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.legalName}</p>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                Entity Type
                            </label>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.entityType}</p>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                Status
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                                <p style={{
                                    margin: 0,
                                    color: entity.isActive ? '#059669' : '#dc2626',
                                    fontWeight: '500'
                                }}>
                                    {entity.isActive ? 'Active' : 'Inactive'}
                                </p>

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
                                        {entity.isVerified ? (
                                            <>
                                                <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
                                                EIN Verified
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={12} style={{ marginRight: '0.25rem' }} />
                                                EIN Not Verified
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        {entity.description && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Description
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937', lineHeight: '1.5' }}>
                                    {entity.description}
                                </p>
                            </div>
                        )}
                    </div>

                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '2rem 0 1rem 0'
                    }}>
                        Contact Information
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {entity.address && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Address
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.address}</p>
                            </div>
                        )}

                        {entity.phone && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Phone
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.phone}</p>
                            </div>
                        )}

                        {entity.email && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Email
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.email}</p>
                            </div>
                        )}

                        {entity.fax && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Fax
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.fax}</p>
                            </div>
                        )}

                        {entity.website && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Website
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.website}</p>
                            </div>
                        )}

                        {entity.taxId && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                    Tax ID
                                </label>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1f2937' }}>{entity.taxId}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Entity Statistics */}
                {entityStats && (
                    <div>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '1rem'
                        }}>
                            Performance Statistics
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#f0f9ff',
                                borderRadius: '0.75rem',
                                textAlign: 'center'
                            }}>
                                <Home size={24} style={{ color: '#0ea5e9', margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0c4a6e' }}>
                                    {entityStats.stats.totalProperties}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#075985' }}>Properties</div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '0.75rem',
                                textAlign: 'center'
                            }}>
                                <Users size={24} style={{ color: '#22c55e', margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#14532d' }}>
                                    {entityStats.stats.totalSpaces}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#16a34a' }}>Total Spaces</div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#fefce8',
                                borderRadius: '0.75rem',
                                textAlign: 'center'
                            }}>
                                <CheckCircle size={24} style={{ color: '#eab308', margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#713f12' }}>
                                    {entityStats.stats.activeLeases}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#a16207' }}>Active Leases</div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#fdf2f8',
                                borderRadius: '0.75rem',
                                textAlign: 'center'
                            }}>
                                <TrendingUp size={24} style={{ color: '#ec4899', margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#831843' }}>
                                    {entityStats.stats.occupancyRate}%
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#be185d' }}>Occupancy Rate</div>
                            </div>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '0.75rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '1rem'
                            }}>
                                Financial Summary
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Monthly Rent Roll</span>
                                    <span style={{ fontWeight: '600', color: '#059669' }}>
                                        ${entityStats.stats.monthlyRentRoll.toLocaleString()}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Bank Balance</span>
                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                        ${entityStats.stats.totalBalance.toLocaleString()}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Bank Accounts</span>
                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                        {entityStats.stats.totalBankLedgers}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};