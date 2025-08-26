// src/components/entities/EntityModal.tsx
import React from 'react';
import type { Entity, EntityStats, CreateEntityDto, UpdateEntityDto } from '../../types/entity';
import { EntityViewContent } from './EntityViewContent';
import { EntityFormContent } from './EntityFormContent';

interface EntityModalProps {
    entity: Entity | null;
    entityStats: EntityStats | null;
    mode: 'view' | 'create' | 'edit';
    onClose: () => void;
    onSave: (data: CreateEntityDto | UpdateEntityDto) => void;
}

export const EntityModal: React.FC<EntityModalProps> = ({
    entity,
    entityStats,
    mode,
    onClose,
    onSave
}) => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: mode === 'view' ? '800px' : '600px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    position: 'relative'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0
                    }}>
                        {mode === 'view' && 'Entity Details'}
                        {mode === 'create' && 'Create New Entity'}
                        {mode === 'edit' && 'Edit Entity'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: '1.5rem',
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                {mode === 'view' ? (
                    <EntityViewContent entity={entity} entityStats={entityStats} />
                ) : (
                    <EntityFormContent
                        entity={entity}
                        mode={mode}
                        onSave={onSave}
                        onCancel={onClose}
                    />
                )}
            </div>
        </div>
    );
};