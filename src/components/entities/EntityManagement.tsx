// src/components/entities/EntityManagement.tsx
import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Filter } from 'lucide-react';
import { EntityCard } from './EntityCard';
import { EntityModal } from './EntityModal';
import { entitiesService } from '../../services/api/entitiesService';
import type { Entity, EntityStats, EntityQuery, CreateEntityDto, UpdateEntityDto } from '../../types/entity';

interface EntityManagementProps { }

export const EntityManagement: React.FC<EntityManagementProps> = () => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [entityTypeFilter, setEntityTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
    const [entityStats, setEntityStats] = useState<EntityStats | null>(null);

    useEffect(() => {
        loadEntities();
    }, [searchQuery, entityTypeFilter, statusFilter]);

    const loadEntities = async () => {
        try {
            setLoading(true);
            const query: EntityQuery = {
                search: searchQuery || undefined,
                entityType: entityTypeFilter || undefined,
                status: statusFilter || undefined
            };
            const response = await entitiesService.getEntities(query);
            setEntities(response.data || []);
        } catch (err) {
            setError('Failed to load entities');
            console.error('Error loading entities:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadEntityStats = async (entityId: string) => {
        try {
            const response = await entitiesService.getEntityStats(entityId);
            setEntityStats(response.data);
        } catch (err) {
            console.error('Error loading entity stats:', err);
        }
    };

    const handleViewEntity = (entity: Entity) => {
        setSelectedEntity(entity);
        setModalMode('view');
        setShowModal(true);
        loadEntityStats(entity.id);
    };

    const handleCreateEntity = () => {
        setSelectedEntity(null);
        setModalMode('create');
        setShowModal(true);
        setEntityStats(null);
    };

    const handleEditEntity = (entity: Entity) => {
        setSelectedEntity(entity);
        setModalMode('edit');
        setShowModal(true);
        setEntityStats(null);
    };

    const handleDeleteEntity = async (entity: Entity) => {
        if (window.confirm(`Are you sure you want to delete ${entity.name}? This action cannot be undone.`)) {
            try {
                await entitiesService.deleteEntity(entity.id);
                await loadEntities();
            } catch (err) {
                alert('Failed to delete entity');
            }
        }
    };

    const handleSaveEntity = async (formData: CreateEntityDto | UpdateEntityDto) => {
        try {
            if (modalMode === 'create') {
                await entitiesService.createEntity(formData as CreateEntityDto);
            } else if (selectedEntity) {
                await entitiesService.updateEntity(selectedEntity.id, formData as UpdateEntityDto);
            }
            setShowModal(false);
            await loadEntities();
        } catch (err) {
            alert('Failed to save entity');
        }
    };

    const filteredEntities = entities.filter(entity => {
        const matchesSearch = !searchQuery ||
            entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entity.entityType.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = !entityTypeFilter || entity.entityType === entityTypeFilter;
        const matchesStatus = !statusFilter ||
            (statusFilter === 'active' && entity.isActive) ||
            (statusFilter === 'inactive' && !entity.isActive);

        return matchesSearch && matchesType && matchesStatus;
    });

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading entities...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        margin: 0,
                        marginBottom: '0.5rem'
                    }}>
                        Entity Management
                    </h1>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                        Manage your business entities, properties, and financial accounts
                    </p>
                </div>
                <button
                    onClick={handleCreateEntity}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                >
                    <Plus size={18} />
                    New Entity
                </button>
            </div>

            {/* Search and Filters */}
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search entities by name, legal name, or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: showFilters ? '#f3f4f6' : 'white',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                {showFilters && (
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <select
                            value={entityTypeFilter}
                            onChange={(e) => setEntityTypeFilter(e.target.value)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                minWidth: '150px'
                            }}
                        >
                            <option value="">All Types</option>
                            <option value="LLC">LLC</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                minWidth: '120px'
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Entity Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredEntities.map(entity => (
                    <EntityCard
                        key={entity.id}
                        entity={entity}
                        onView={() => handleViewEntity(entity)}
                        onEdit={() => handleEditEntity(entity)}
                        onDelete={() => handleDeleteEntity(entity)}
                    />
                ))}
            </div>

            {filteredEntities.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <Building2 size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No entities found</h3>
                    <p style={{ color: '#6b7280' }}>
                        {searchQuery || entityTypeFilter || statusFilter
                            ? 'Try adjusting your search criteria'
                            : 'Get started by creating your first entity'
                        }
                    </p>
                </div>
            )}

            {/* Entity Modal */}
            {showModal && (
                <EntityModal
                    entity={selectedEntity}
                    entityStats={entityStats}
                    mode={modalMode}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveEntity}
                />
            )}
        </div>
    );
};