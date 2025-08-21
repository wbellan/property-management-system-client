import React, { useState, useEffect } from 'react';
import {
    Shield,
    Building2,
    UserCheck,
    X,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

// Interface matching your existing User structure
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    entities: Array<{ id: string; name: string; entityType: string }>;
    properties: Array<{ id: string; name: string; address?: string }>;
}

interface Entity {
    id: string;
    name: string;
    entityType: string;
}

interface Property {
    id: string;
    name: string;
    address?: string;
    entityId?: string;
}

interface UserAccessModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onSave: (userId: string, updatedData: {
        role: string;
        status: 'ACTIVE' | 'INACTIVE' | 'PENDING'; // Fixed: specific status types
        entityIds: string[];
        propertyIds: string[];
    }) => Promise<void>;
    entities: Entity[];
    properties: Property[];
    currentUserRole: string;
}

// Role definitions
const USER_ROLES = {
    SUPER_ADMIN: {
        label: 'Super Administrator',
        description: 'Full system access across all organizations',
        color: 'from-red-500 to-pink-500',
        canEdit: [],
    },
    ORG_ADMIN: {
        label: 'Organization Admin',
        description: 'Organization-level access and user management',
        color: 'from-purple-500 to-indigo-500',
        canEdit: ['ENTITY_MANAGER', 'PROPERTY_MANAGER', 'ACCOUNTANT', 'MAINTENANCE', 'TENANT'],
    },
    ENTITY_MANAGER: {
        label: 'Entity Manager',
        description: 'Manage specific entities and their properties',
        color: 'from-blue-500 to-cyan-500',
        canEdit: ['PROPERTY_MANAGER', 'ACCOUNTANT', 'MAINTENANCE', 'TENANT'],
    },
    PROPERTY_MANAGER: {
        label: 'Property Manager',
        description: 'Manage specific properties and tenants',
        color: 'from-green-500 to-emerald-500',
        canEdit: ['TENANT'],
    },
    ACCOUNTANT: {
        label: 'Accountant',
        description: 'Financial data access and reporting',
        color: 'from-yellow-500 to-orange-500',
        canEdit: [],
    },
    MAINTENANCE: {
        label: 'Maintenance Staff',
        description: 'Maintenance requests and work orders',
        color: 'from-orange-500 to-red-500',
        canEdit: [],
    },
    TENANT: {
        label: 'Tenant',
        description: 'Limited access to own data only',
        color: 'from-gray-500 to-gray-600',
        canEdit: [],
    },
};

export const UserAccessModal: React.FC<UserAccessModalProps> = ({
    user,
    isOpen,
    onClose,
    onSave,
    entities,
    properties,
    currentUserRole
}) => {
    // FIXED: Proper type for status
    const [formData, setFormData] = useState<{
        role: string;
        entityIds: string[];
        propertyIds: string[];
        status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    }>({
        role: user.role,
        entityIds: user.entities?.map(e => e.id) || [],
        propertyIds: user.properties?.map(p => p.id) || [],
        status: (user.status as 'ACTIVE' | 'INACTIVE' | 'PENDING') || 'ACTIVE'
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            console.log('UserAccessModal: Setting form data for user:', {
                userId: user.id,
                role: user.role,
                status: user.status,
                entities: user.entities,
                properties: user.properties
            });

            setFormData({
                role: user.role,
                entityIds: user.entities?.map(e => e.id) || [],
                propertyIds: user.properties?.map(p => p.id) || [],
                status: (user.status as 'ACTIVE' | 'INACTIVE' | 'PENDING') || 'ACTIVE'
            });
        }
    }, [user]);

    const canEditRole = (role: string) => {
        const currentRole = USER_ROLES[currentUserRole as keyof typeof USER_ROLES];
        return currentRole?.canEdit.includes(role) || currentUserRole === 'SUPER_ADMIN';
    };

    const availableRoles = Object.entries(USER_ROLES).filter(([roleKey]) =>
        canEditRole(roleKey) || roleKey === user.role
    );

    const filteredProperties = properties.filter(p =>
        formData.entityIds.length === 0 || formData.entityIds.includes(p.entityId || '')
    );

    const handleSave = async () => {
        setLoading(true);
        setErrors([]);

        try {
            // FIXED: Enhanced validation with logging
            const newErrors: string[] = [];

            console.log('UserAccessModal: Saving with form data:', formData);

            if (!formData.role) {
                newErrors.push('Role is required');
            }

            if (['ENTITY_MANAGER', 'PROPERTY_MANAGER'].includes(formData.role) && formData.entityIds.length === 0) {
                newErrors.push('At least one entity must be selected for this role');
            }

            if (formData.role === 'PROPERTY_MANAGER' && formData.propertyIds.length === 0) {
                newErrors.push('At least one property must be selected for Property Manager role');
            }

            if (newErrors.length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            // FIXED: Clear entityIds and propertyIds based on role restrictions
            let finalEntityIds = formData.entityIds;
            let finalPropertyIds = formData.propertyIds;

            // If role doesn't support entity access, clear entities
            if (!['ENTITY_MANAGER', 'PROPERTY_MANAGER', 'ACCOUNTANT'].includes(formData.role)) {
                finalEntityIds = [];
            }

            // If role doesn't support property access, clear properties  
            if (!['PROPERTY_MANAGER'].includes(formData.role)) {
                finalPropertyIds = [];
            }

            console.log('UserAccessModal: Final data after role restrictions:', {
                role: formData.role,
                entityIds: finalEntityIds,
                propertyIds: finalPropertyIds
            });

            // FIXED: Ensure the data structure matches exactly what the API expects
            const saveData = {
                role: formData.role,
                status: formData.status,
                entityIds: finalEntityIds,
                propertyIds: finalPropertyIds
            };

            console.log('UserAccessModal: Calling onSave with:', {
                userId: user.id,
                saveData
            });

            await onSave(user.id, saveData);

            console.log('UserAccessModal: Save successful, closing modal');
            onClose();
        } catch (error) {
            console.error('UserAccessModal: Save failed:', error);
            setErrors(['Failed to update user access. Please try again.']);
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Add logging for entity selection changes
    const handleEntityChange = (entityId: string, checked: boolean) => {
        console.log('UserAccessModal: Entity selection changed:', { entityId, checked });

        if (checked) {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    entityIds: [...prev.entityIds, entityId]
                };
                console.log('UserAccessModal: New entity data:', newData);
                return newData;
            });
        } else {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    entityIds: prev.entityIds.filter(id => id !== entityId),
                    propertyIds: prev.propertyIds.filter(pId =>
                        !properties.some(p => p.id === pId && p.entityId === entityId)
                    )
                };
                console.log('UserAccessModal: Removed entity data:', newData);
                return newData;
            });
        }
    };

    // Update the role change handler to clear inappropriate access
    const handleRoleChange = (newRole: string) => {
        console.log('UserAccessModal: Role changed to:', newRole);

        setFormData(prev => {
            const newData = { ...prev, role: newRole };

            // Clear entity access if new role doesn't support it
            if (!['ENTITY_MANAGER', 'PROPERTY_MANAGER', 'ACCOUNTANT'].includes(newRole)) {
                newData.entityIds = [];
                newData.propertyIds = []; // Also clear properties since they depend on entities
            }

            // Clear property access if new role doesn't support it
            if (!['PROPERTY_MANAGER'].includes(newRole)) {
                newData.propertyIds = [];
            }

            console.log('UserAccessModal: New form data after role change:', newData);
            return newData;
        });
    };

    // FIXED: Add logging for property selection changes
    const handlePropertyChange = (propertyId: string, checked: boolean) => {
        console.log('UserAccessModal: Property selection changed:', { propertyId, checked });

        if (checked) {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    propertyIds: [...prev.propertyIds, propertyId]
                };
                console.log('UserAccessModal: New property data:', newData);
                return newData;
            });
        } else {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    propertyIds: prev.propertyIds.filter(id => id !== propertyId)
                };
                console.log('UserAccessModal: Removed property data:', newData);
                return newData;
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            overflow: 'auto'
        }}>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)'
                }}
                onClick={onClose}
            ></div>

            <div style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: '100%',
                    maxWidth: '32rem',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}>

                    {/* Header */}
                    <div style={{
                        position: 'sticky',
                        top: 0,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        padding: '1.5rem',
                        borderTopLeftRadius: '1.5rem',
                        borderTopRightRadius: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '3rem',
                                    height: '3rem',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Shield style={{ width: '1.5rem', height: '1.5rem' }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Manage User Access</h2>
                                    <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: 0 }}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* DEBUGGING: Show current form state */}
                        {process.env.NODE_ENV === 'development' && (
                            <div style={{
                                background: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.75rem',
                                padding: '1rem',
                                fontSize: '0.75rem',
                                fontFamily: 'monospace'
                            }}>
                                <strong>Debug Info:</strong><br />
                                Role: {formData.role}<br />
                                Status: {formData.status}<br />
                                Entities: [{formData.entityIds.join(', ')}]<br />
                                Properties: [{formData.propertyIds.join(', ')}]<br />
                                Available Entities: {entities.length}<br />
                                Available Properties: {properties.length}<br />
                                Filtered Properties: {filteredProperties.length}
                            </div>
                        )}

                        {/* Error Messages */}
                        {errors.length > 0 && (
                            <div style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '0.75rem',
                                padding: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444', marginTop: '0.125rem' }} />
                                    <div>
                                        <h4 style={{ color: '#991b1b', fontWeight: 500, margin: '0 0 0.25rem 0' }}>Please fix the following errors:</h4>
                                        <ul style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0.25rem 0 0 0', paddingLeft: '1rem' }}>
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Status */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                                User Status
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                {(['ACTIVE', 'INACTIVE', 'PENDING'] as const).map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => {
                                            console.log('UserAccessModal: Status changed to:', status);
                                            setFormData(prev => ({ ...prev, status }));
                                        }}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            border: `2px solid ${formData.status === status ? '#6366f1' : '#d1d5db'}`,
                                            background: formData.status === status ? '#eef2ff' : 'transparent',
                                            color: formData.status === status ? '#4338ca' : '#6b7280',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {status === 'ACTIVE' && <CheckCircle style={{ width: '1rem', height: '1rem' }} />}
                                        {status === 'INACTIVE' && <X style={{ width: '1rem', height: '1rem' }} />}
                                        {status === 'PENDING' && <AlertCircle style={{ width: '1rem', height: '1rem' }} />}
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                                User Role
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {availableRoles.map(([roleKey, roleData]) => (
                                    <button
                                        key={roleKey}
                                        type="button"
                                        onClick={() => handleRoleChange(roleKey)} // FIXED: Use the proper handler
                                        disabled={!canEditRole(roleKey) && roleKey !== user.role}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            border: `2px solid ${formData.role === roleKey ? '#6366f1' : '#d1d5db'}`,
                                            background: formData.role === roleKey ? '#eef2ff' : 'transparent',
                                            textAlign: 'left',
                                            cursor: (!canEditRole(roleKey) && roleKey !== user.role) ? 'not-allowed' : 'pointer',
                                            opacity: (!canEditRole(roleKey) && roleKey !== user.role) ? 0.5 : 1,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                background: `linear-gradient(135deg, ${roleData.color.replace('from-', '').replace(' to-', ', ')})`,
                                                borderRadius: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Shield style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontWeight: 600, color: '#111827', margin: '0 0 0.25rem 0' }}>{roleData.label}</h4>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{roleData.description}</p>
                                            </div>
                                            {formData.role === roleKey && (
                                                <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1' }} />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Only show entity access for roles that support it */}
                        {['ENTITY_MANAGER', 'PROPERTY_MANAGER', 'ACCOUNTANT'].includes(formData.role) && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                                    <Building2 style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                                    Entity Access ({entities.length} available)
                                </label>
                                <div style={{
                                    background: '#f9fafb',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    maxHeight: '12rem',
                                    overflow: 'auto'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {entities.map((entity) => (
                                            <label
                                                key={entity.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.5rem',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'white'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.entityIds.includes(entity.id)}
                                                    onChange={(e) => handleEntityChange(entity.id, e.target.checked)}
                                                    style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                        accentColor: '#6366f1',
                                                        borderRadius: '0.25rem'
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 500, color: '#111827' }}>{entity.name}</div>
                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{entity.entityType}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Only show property access for PROPERTY_MANAGER role */}
                        {formData.role === 'PROPERTY_MANAGER' && filteredProperties.length > 0 && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                                    <UserCheck style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                                    Property Access ({filteredProperties.length} available)
                                </label>
                                <div style={{
                                    background: '#f9fafb',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    maxHeight: '12rem',
                                    overflow: 'auto'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {filteredProperties.map((property) => (
                                            <label
                                                key={property.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.5rem',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'white'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.propertyIds.includes(property.id)}
                                                    onChange={(e) => handlePropertyChange(property.id, e.target.checked)}
                                                    style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                        accentColor: '#6366f1',
                                                        borderRadius: '0.25rem'
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 500, color: '#111827' }}>{property.name}</div>
                                                    {property.address && (
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{property.address}</div>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1.5rem',
                                    border: '1px solid #d1d5db',
                                    color: '#374151',
                                    borderRadius: '0.75rem',
                                    fontWeight: 500,
                                    background: 'white',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.5 : 1,
                                    transition: 'opacity 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{
                                            width: '1rem',
                                            height: '1rem',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save style={{ width: '1rem', height: '1rem' }} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS animations */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};