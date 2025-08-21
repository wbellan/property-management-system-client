import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Settings, Mail, Shield, Building2, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';
import { userAccessService } from '../../services/api/userAccessService';
import { UserAccessModal } from '../../components/users/UserAccessModal';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    emailVerified: boolean;
    lastLoginAt: Date | null;
    isPendingInvite: boolean;
    entities: any[];
    properties: any[];
    tenantProfile: any;
    createdAt: Date;
}

export const UsersPage: React.FC = () => {
    const { user, token, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [error, setError] = useState<string | null>(null);

    // User Access Modal states
    const [selectedUserForAccess, setSelectedUserForAccess] = useState<User | null>(null);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [accessEntities, setAccessEntities] = useState<any[]>([]);
    const [accessProperties, setAccessProperties] = useState<any[]>([]);

    useEffect(() => {
        // Only load users when auth is complete and we have the required data
        if (!authLoading && user?.organizationId && token) {
            console.log('UsersPage: Auth ready, loading users...', {
                authLoading,
                organizationId: user.organizationId,
                hasToken: !!token
            });
            loadUsers();
        } else {
            console.log('UsersPage: Waiting for auth...', {
                authLoading,
                organizationId: user?.organizationId,
                hasToken: !!token
            });
        }
    }, [user?.organizationId, token, authLoading]);

    const handleManageAccessClick = async (selectedUser: User) => {
        setSelectedUserForAccess(selectedUser);

        // Load entities and properties for the modal
        if (token?.startsWith('demo-jwt-token')) {
            // Demo data
            setAccessEntities([
                { id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' },
                { id: 'demo-entity-2', name: 'Sunset Properties Inc', entityType: 'Corporation' }
            ]);
            setAccessProperties([
                { id: 'demo-property-1', name: 'Sunset Apartments', entityId: 'demo-entity' },
                { id: 'demo-property-2', name: 'Ocean View Complex', entityId: 'demo-entity' }
            ]);
        } else {
            // Real API call using userAccessService
            try {
                const response = await userAccessService.getEntitiesAndProperties(user!.organizationId);
                setAccessEntities(response.data.entities || []);
                setAccessProperties(response.data.properties || []);
            } catch (error) {
                console.error('Failed to load access options:', error);
                // Set empty arrays as fallback
                setAccessEntities([]);
                setAccessProperties([]);
            }
        }

        setShowAccessModal(true);
    };

    const handleSaveUserAccess = async (userId: string, updatedData: {
        role: string;
        status: string;
        entityIds: string[];
        propertyIds: string[];
    }) => {
        try {
            if (token?.startsWith('demo-jwt-token')) {
                // Demo mode - just update local state
                setUsers(prev => prev.map(user =>
                    user.id === userId
                        ? {
                            ...user,
                            role: updatedData.role,
                            status: updatedData.status,
                            entities: accessEntities.filter(e => updatedData.entityIds.includes(e.id)),
                            properties: accessProperties.filter(p => updatedData.propertyIds.includes(p.id))
                        }
                        : user
                ));

                // Show success message
                alert('User access updated successfully!');
            } else {
                // Real API call using userAccessService
                await userAccessService.updateUserAccess(userId, {
                    role: updatedData.role,
                    status: updatedData.status as 'ACTIVE' | 'INACTIVE' | 'PENDING',
                    entityIds: updatedData.entityIds,
                    propertyIds: updatedData.propertyIds
                });

                // Reload users to get updated data
                await loadUsers();
                alert('User access updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update user access:', error);
            alert('Failed to update user access. Please try again.');
            throw error; // Re-throw so the modal can handle it
        }
    };

    const loadUsers = async () => {
        // Don't proceed if we don't have required auth data
        if (!user?.organizationId || !token) {
            console.log('UsersPage: Missing auth data:', { organizationId: user?.organizationId, hasToken: !!token });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('UsersPage: Loading users for organization:', user.organizationId);

            // FIXED: Handle demo mode properly
            if (token.startsWith('demo-jwt-token')) {
                console.log('UsersPage: Using demo mode');
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                const demoUsers: User[] = [
                    {
                        id: '1',
                        email: 'admin@demoproperties.com',
                        firstName: 'Admin',
                        lastName: 'User',
                        role: 'SUPER_ADMIN',
                        status: 'ACTIVE',
                        emailVerified: true,
                        lastLoginAt: new Date(),
                        isPendingInvite: false,
                        entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' }],
                        properties: [],
                        tenantProfile: null,
                        createdAt: new Date()
                    },
                    {
                        id: '2',
                        email: 'orgadmin@demoproperties.com',
                        firstName: 'Org',
                        lastName: 'Admin',
                        role: 'ORG_ADMIN',
                        status: 'ACTIVE',
                        emailVerified: true,
                        lastLoginAt: new Date(Date.now() - 86400000), // 1 day ago
                        isPendingInvite: false,
                        entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' }],
                        properties: [],
                        tenantProfile: null,
                        createdAt: new Date()
                    },
                    {
                        id: '3',
                        email: 'manager@sunsetproperties.com',
                        firstName: 'Property',
                        lastName: 'Manager',
                        role: 'ENTITY_MANAGER',
                        status: 'ACTIVE',
                        emailVerified: true,
                        lastLoginAt: new Date(Date.now() - 172800000), // 2 days ago
                        isPendingInvite: false,
                        entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' }],
                        properties: [],
                        tenantProfile: null,
                        createdAt: new Date()
                    },
                    {
                        id: '4',
                        email: 'maintenance@demoproperties.com',
                        firstName: 'Maintenance',
                        lastName: 'Staff',
                        role: 'MAINTENANCE',
                        status: 'ACTIVE',
                        emailVerified: true,
                        lastLoginAt: new Date(Date.now() - 259200000), // 3 days ago
                        isPendingInvite: false,
                        entities: [],
                        properties: [],
                        tenantProfile: null,
                        createdAt: new Date()
                    },
                    {
                        id: '5',
                        email: 'tenant@example.com',
                        firstName: 'John',
                        lastName: 'Tenant',
                        role: 'TENANT',
                        status: 'ACTIVE',
                        emailVerified: true,
                        lastLoginAt: new Date(Date.now() - 345600000), // 4 days ago
                        isPendingInvite: false,
                        entities: [],
                        properties: [],
                        tenantProfile: { id: 'tenant-profile-1', businessName: null },
                        createdAt: new Date()
                    },
                    {
                        id: '6',
                        email: 'newuser@example.com',
                        firstName: 'Pending',
                        lastName: 'User',
                        role: 'PROPERTY_MANAGER',
                        status: 'PENDING',
                        emailVerified: false,
                        lastLoginAt: null,
                        isPendingInvite: true,
                        entities: [],
                        properties: [],
                        tenantProfile: null,
                        createdAt: new Date()
                    }
                ];

                console.log('UsersPage: Demo users loaded:', demoUsers.length);
                setUsers(demoUsers);
            } else {
                // Real API call using userAccessService
                console.log('UsersPage: Making real API call');
                const response = await userAccessService.getOrganizationUsers(user.organizationId);
                console.log('UsersPage: API response:', response);
                setUsers(response.data || []);
            }
        } catch (error) {
            console.error('UsersPage: Failed to load users:', error);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while auth is initializing
    if (authLoading) {
        return (
            <div className="users-loading">
                <div className="loading-spinner"></div>
                <p>Initializing...</p>
            </div>
        );
    }

    // Show error if no auth data
    if (!user?.organizationId) {
        return (
            <div className="users-loading">
                <p>Unable to load organization data. Please try logging out and back in.</p>
            </div>
        );
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole === 'all' || u.role === selectedRole;
        const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const UserCard = ({ user: u }: { user: User }) => (
        <div className="card hover-lift" style={{ marginBottom: '1.5rem' }}>
            <div className="flex items-start justify-between" style={{ marginBottom: '1.5rem' }}>
                <div className="flex items-center" style={{ gap: '1rem' }}>
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        flexShrink: 0,
                        background: u.status === 'ACTIVE'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : u.status === 'PENDING'
                                ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
                                : '#9ca3af'
                    }}>
                        {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                            {u.firstName} {u.lastName}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>{u.email}</p>
                        {u.tenantProfile && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                background: 'rgba(139, 92, 246, 0.1)',
                                color: '#7c3aed'
                            }}>
                                Has Tenant Profile
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="property-action-btn">
                        <Settings style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    {u.isPendingInvite && (
                        <button
                            onClick={() => handleResendInvite(u.id)}
                            className="property-action-btn"
                            title="Resend invitation"
                        >
                            <Mail style={{ width: '1rem', height: '1rem' }} />
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Role</p>
                    <div className="flex items-center space-x-2">
                        <Shield style={{ width: '1rem', height: '1rem', color: 'var(--indigo-500)' }} />
                        <span style={{ fontWeight: 500 }}>{formatRole(u.role)}</span>
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Status</p>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        ...(u.isPendingInvite ? { background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' } :
                            u.status === 'ACTIVE' ? { background: 'rgba(16, 185, 129, 0.1)', color: '#059669' } :
                                u.status === 'PENDING' ? { background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' } :
                                    { background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' })
                    }}>
                        {u.isPendingInvite ? 'Pending Invite' :
                            u.status === 'ACTIVE' ? 'Active' :
                                u.status === 'PENDING' ? 'Pending Setup' : 'Inactive'}
                    </span>
                </div>
            </div>

            {u.entities.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>Entity Access</p>
                    <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
                        {u.entities.map(entity => (
                            <span key={entity.id} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: '#2563eb'
                            }}>
                                <Building2 style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.5rem' }} />
                                {entity.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                <div className="flex items-center justify-between" style={{ minHeight: '2.5rem' }}>
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--gray-500)',
                            display: 'block',
                            lineHeight: '1.4'
                        }}>
                            {u.lastLoginAt ? `Last login: ${new Date(u.lastLoginAt).toLocaleDateString()}` : 'Never logged in'}
                        </span>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        <button
                            onClick={() => handleManageAccessClick(u)}
                            style={{
                                fontSize: '0.875rem',
                                color: 'var(--indigo-600)',
                                fontWeight: 500,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                (e.target as HTMLButtonElement).style.color = 'var(--indigo-700)';
                                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                            }}
                            onMouseOut={(e) => {
                                (e.target as HTMLButtonElement).style.color = 'var(--indigo-600)';
                                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                            }}
                        >
                            Manage Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleResendInvite = async (userId: string) => {
        try {
            if (token?.startsWith('demo-jwt-token')) {
                alert('Demo: Invitation would be resent to user');
                return;
            }
            await apiService.request(`/users/${userId}/resend-invitation`, { method: 'POST' }, token);
            alert('Invitation resent successfully');
        } catch (error) {
            console.error('Failed to resend invitation:', error);
            alert('Failed to resend invitation');
        }
    };

    const formatRole = (role: string) => {
        const roleNames: Record<string, string> = {
            'SUPER_ADMIN': 'Super Admin',
            'ORG_ADMIN': 'Organization Admin',
            'ENTITY_MANAGER': 'Entity Manager',
            'PROPERTY_MANAGER': 'Property Manager',
            'TENANT': 'Tenant',
            'MAINTENANCE': 'Maintenance Staff',
            'ACCOUNTANT': 'Accountant',
        };
        return roleNames[role] || role;
    };

    if (loading) {
        return (
            <div className="users-loading">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="users-loading">
                <p>{error}</p>
                <button onClick={loadUsers} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="users-container">
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    background: '#f3f4f6',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    fontSize: '0.75rem'
                }}>
                    Debug: Org ID: {user?.organizationId}, Users loaded: {users.length}, Token: {token ? (token.startsWith('demo') ? 'Demo Token' : 'Real Token') : 'Missing'}
                </div>
            )}

            {/* Header */}
            <div className="users-header">
                <div>
                    <h1 className="users-title">User Management</h1>
                    <p className="users-subtitle">Manage team members, tenants, and their access levels</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn btn-primary"
                >
                    <UserPlus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Invite User
                </button>
            </div>

            {/* Filters */}
            <div className="users-toolbar">
                <div className="search-container">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Roles</option>
                    <option value="ORG_ADMIN">Organization Admin</option>
                    <option value="ENTITY_MANAGER">Entity Manager</option>
                    <option value="PROPERTY_MANAGER">Property Manager</option>
                    <option value="TENANT">Tenant</option>
                    <option value="MAINTENANCE">Maintenance Staff</option>
                    <option value="ACCOUNTANT">Accountant</option>
                </select>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-blue" style={{ flexShrink: 0 }}>
                            <Users style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">{users.length}</p>
                            <p className="stat-label">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-green" style={{ flexShrink: 0 }}>
                            <Shield style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">
                                {users.filter(u => u.status === 'ACTIVE').length}
                            </p>
                            <p className="stat-label">Active Users</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-orange" style={{ flexShrink: 0 }}>
                            <Mail style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">
                                {users.filter(u => u.isPendingInvite).length}
                            </p>
                            <p className="stat-label">Pending Invites</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-purple" style={{ flexShrink: 0 }}>
                            <Building2 style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">
                                {users.filter(u => u.role === 'TENANT').length}
                            </p>
                            <p className="stat-label">Tenants</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="properties-grid">
                {filteredUsers.map((u) => (
                    <UserCard key={u.id} user={u} />
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="users-empty">
                    <Users className="empty-icon" />
                    <h3 className="empty-title">No users found</h3>
                    <p className="empty-subtitle">
                        {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                            ? 'Try adjusting your search filters or invite new users.'
                            : 'Get started by inviting your first team member.'
                        }
                    </p>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn btn-primary"
                    >
                        <UserPlus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                        Invite User
                    </button>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <InviteUserModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    onSuccess={loadUsers}
                />
            )}

            {/* User Access Modal */}
            {selectedUserForAccess && (
                <UserAccessModal
                    user={selectedUserForAccess}
                    isOpen={showAccessModal}
                    onClose={() => {
                        setShowAccessModal(false);
                        setSelectedUserForAccess(null);
                    }}
                    onSave={handleSaveUserAccess}
                    entities={accessEntities}
                    properties={accessProperties}
                    currentUserRole={user?.role || 'ORG_ADMIN'}
                />
            )}
        </div>
    );
};

// Enhanced Invite User Modal (unchanged from your existing code)
const InviteUserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'PROPERTY_MANAGER',
        entityIds: [] as string[],
        propertyIds: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [entities, setEntities] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadAccessOptions();
        }
    }, [isOpen]);

    const loadAccessOptions = async () => {
        try {
            // For demo mode, provide mock options
            if (token?.startsWith('demo-jwt-token')) {
                setEntities([
                    { id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' },
                    { id: 'demo-entity-2', name: 'Sunset Properties Inc', entityType: 'Corporation' }
                ]);
                setProperties([
                    { id: 'demo-property-1', name: 'Sunset Apartments' },
                    { id: 'demo-property-2', name: 'Ocean View Complex' }
                ]);
                return;
            }

            // Real API call
            const response = await apiService.request(
                `/users/access-options/${user?.organizationId}`,
                {},
                token
            );
            setEntities(response.entities || []);
            setProperties(response.properties || []);
        } catch (error) {
            console.error('Failed to load access options:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (token?.startsWith('demo-jwt-token')) {
                // Demo mode - simulate invitation
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Demo: Invitation would be sent to ' + formData.email);
            } else {
                // Real API call
                await apiService.request('/users/invite', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                }, token);
                alert('Invitation sent successfully!');
            }

            onSuccess();
            onClose();
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                role: 'PROPERTY_MANAGER',
                entityIds: [],
                propertyIds: [],
            });
        } catch (error) {
            console.error('Failed to invite user:', error);
            alert('Failed to send invitation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
            }} onClick={onClose}></div>

            <div style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                padding: '2rem',
                maxWidth: '32rem',
                width: '100%',
                margin: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
                    Invite New User
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="form-input"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="form-input"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="form-input"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="form-input"
                        >
                            <option value="ORG_ADMIN">Organization Admin</option>
                            <option value="ENTITY_MANAGER">Entity Manager</option>
                            <option value="PROPERTY_MANAGER">Property Manager</option>
                            <option value="MAINTENANCE">Maintenance Staff</option>
                            <option value="TENANT">Tenant</option>
                            <option value="ACCOUNTANT">Accountant</option>
                        </select>
                    </div>

                    {entities.length > 0 && (
                        <div>
                            <label className="form-label">Entity Access (Optional)</label>
                            <div style={{
                                maxHeight: '8rem',
                                overflowY: 'auto',
                                background: 'rgba(249, 250, 251, 0.5)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem'
                            }} className="space-y-2">
                                {entities.map(entity => (
                                    <label key={entity.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.entityIds.includes(entity.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({
                                                        ...formData,
                                                        entityIds: [...formData.entityIds, entity.id]
                                                    });
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        entityIds: formData.entityIds.filter(id => id !== entity.id)
                                                    });
                                                }
                                            }}
                                            style={{
                                                borderRadius: '0.25rem',
                                                borderColor: 'var(--gray-300)',
                                                color: 'var(--indigo-600)'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                                            {entity.name} ({entity.entityType})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4" style={{ paddingTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex-1"
                            style={loading ? { opacity: 0.5 } : {}}
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};