import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Settings, Mail, Shield, Building2, UserPlus, UserCheck } from 'lucide-react';
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
        if (!authLoading && user?.organizationId && token) {
            loadUsers();
        }
    }, [user?.organizationId, token, authLoading]);

    const handleManageAccessClick = async (selectedUser: User) => {
        setSelectedUserForAccess(selectedUser);

        if (token?.startsWith('demo-jwt-token')) {
            setAccessEntities([
                { id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' },
                { id: 'demo-entity-2', name: 'Sunset Properties Inc', entityType: 'Corporation' }
            ]);
            setAccessProperties([
                { id: 'demo-property-1', name: 'Sunset Apartments', entityId: 'demo-entity' },
                { id: 'demo-property-2', name: 'Ocean View Complex', entityId: 'demo-entity' }
            ]);
        } else {
            try {
                const response = await userAccessService.getEntitiesAndProperties(user!.organizationId);
                setAccessEntities(response.data.entities || []);
                setAccessProperties(response.data.properties || []);
            } catch (error) {
                console.error('Failed to load access options:', error);
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
                alert('User access updated successfully!');
            } else {
                await userAccessService.updateUserAccess(userId, {
                    role: updatedData.role,
                    status: updatedData.status as 'ACTIVE' | 'INACTIVE' | 'PENDING',
                    entityIds: updatedData.entityIds,
                    propertyIds: updatedData.propertyIds
                });
                await loadUsers();
                alert('User access updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update user access:', error);
            alert('Failed to update user access. Please try again.');
            throw error;
        }
    };

    const loadUsers = async () => {
        if (!user?.organizationId || !token) return;

        setLoading(true);
        setError(null);

        try {
            if (token.startsWith('demo-jwt-token')) {
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
                        lastLoginAt: new Date(Date.now() - 86400000),
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
                        role: 'PROPERTY_MANAGER',
                        status: 'ACTIVE',
                        emailVerified: true,
                        lastLoginAt: new Date(Date.now() - 172800000),
                        isPendingInvite: false,
                        entities: [{ id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' }],
                        properties: [
                            { id: 'demo-property-1', name: 'Sunset Apartments' },
                            { id: 'demo-property-2', name: 'Ocean View Complex' }
                        ],
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
                        lastLoginAt: new Date(Date.now() - 259200000),
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
                        lastLoginAt: new Date(Date.now() - 345600000),
                        isPendingInvite: false,
                        entities: [],
                        properties: [],
                        tenantProfile: { id: 'tenant-profile-1', businessName: null },
                        createdAt: new Date()
                    }
                ];
                setUsers(demoUsers);
            } else {
                const response = await userAccessService.getOrganizationUsers(user.organizationId);
                setUsers(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="users-loading">
                <div className="loading-spinner"></div>
                <p>Initializing...</p>
            </div>
        );
    }

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
        <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: u.status === 'ACTIVE' ? '#dcfce7' : u.status === 'INACTIVE' ? '#fef2f2' : '#fef3c7',
                    color: u.status === 'ACTIVE' ? '#166534' : u.status === 'INACTIVE' ? '#991b1b' : '#92400e'
                }}>
                    {u.status}
                </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 0.25rem 0' }}>
                    {u.firstName} {u.lastName}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                    {u.email}
                </p>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: '#e0e7ff',
                    color: '#3730a3'
                }}>
                    {formatRole(u.role)}
                </span>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Entities:</strong> {u.entities?.length || 0}
                    {u.entities && u.entities.length > 0 && (
                        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            {u.entities.map(entity => entity.name).join(', ')}
                        </div>
                    )}
                </div>
                <div>
                    <strong>Properties:</strong> {u.properties?.length || 0}
                    {u.properties && u.properties.length > 0 && (
                        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            {u.properties.map(property => property.name).join(', ')}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ color: '#374151', fontWeight: 500, marginBottom: '0.25rem' }}>Access Level:</div>
                <div style={{ color: '#6b7280' }}>
                    {u.role === 'SUPER_ADMIN' && 'Full system access'}
                    {u.role === 'ORG_ADMIN' && 'Organization-wide access'}
                    {u.role === 'ENTITY_MANAGER' && `${u.entities?.length || 0} entities`}
                    {u.role === 'PROPERTY_MANAGER' && `${u.entities?.length || 0} entities, ${u.properties?.length || 0} properties`}
                    {u.role === 'ACCOUNTANT' && `${u.entities?.length || 0} entities (financial only)`}
                    {u.role === 'MAINTENANCE' && 'Maintenance requests only'}
                    {u.role === 'TENANT' && 'Personal data only'}
                </div>
            </div>

            {u.tenantProfile && (
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#7c3aed'
                    }}>
                        <UserCheck style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                        Has Tenant Profile
                    </span>
                </div>
            )}

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {u.lastLoginAt ? `Last login: ${new Date(u.lastLoginAt).toLocaleDateString()}` : 'Never logged in'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {u.isPendingInvite && (
                            <button
                                onClick={() => handleResendInvite(u.id)}
                                style={{
                                    padding: '0.5rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#2563eb',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer'
                                }}
                                title="Resend invitation"
                            >
                                <Mail style={{ width: '1rem', height: '1rem' }} />
                            </button>
                        )}
                        <button
                            onClick={() => handleManageAccessClick(u)}
                            disabled={u.id === user?.id}
                            style={{
                                fontSize: '0.875rem',
                                color: u.id === user?.id ? '#9ca3af' : '#4f46e5',
                                fontWeight: 500,
                                background: 'none',
                                border: 'none',
                                cursor: u.id === user?.id ? 'not-allowed' : 'pointer',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem'
                            }}
                        >
                            {u.id === user?.id ? 'Cannot Edit Self' : 'Manage Access'}
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
            <div className="users-header">
                <div>
                    <h1 className="users-title">User Management</h1>
                    <p className="users-subtitle">Manage team members, tenants, and their access levels</p>
                </div>
                <button onClick={() => setShowInviteModal(true)} className="btn btn-primary">
                    <UserPlus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Invite User
                </button>
            </div>

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
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="filter-select">
                    <option value="all">All Roles</option>
                    <option value="ORG_ADMIN">Organization Admin</option>
                    <option value="ENTITY_MANAGER">Entity Manager</option>
                    <option value="PROPERTY_MANAGER">Property Manager</option>
                    <option value="TENANT">Tenant</option>
                    <option value="MAINTENANCE">Maintenance Staff</option>
                    <option value="ACCOUNTANT">Accountant</option>
                </select>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="filter-select">
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-blue">
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
                        <div className="stat-icon stat-icon-green">
                            <Shield style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">{users.filter(u => u.status === 'ACTIVE').length}</p>
                            <p className="stat-label">Active Users</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-orange">
                            <Mail style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">{users.filter(u => u.isPendingInvite).length}</p>
                            <p className="stat-label">Pending Invites</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center" style={{ gap: '1rem' }}>
                        <div className="stat-icon stat-icon-purple">
                            <Building2 style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <p className="stat-value">{users.filter(u => u.role === 'TENANT').length}</p>
                            <p className="stat-label">Tenants</p>
                        </div>
                    </div>
                </div>
            </div>

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
                    <button onClick={() => setShowInviteModal(true)} className="btn btn-primary">
                        <UserPlus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                        Invite User
                    </button>
                </div>
            )}

            {showInviteModal && (
                <InviteUserModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    onSuccess={loadUsers}
                />
            )}

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

    useEffect(() => {
        if (isOpen) {
            if (token?.startsWith('demo-jwt-token')) {
                setEntities([
                    { id: 'demo-entity', name: 'Demo Properties LLC', entityType: 'LLC' },
                    { id: 'demo-entity-2', name: 'Sunset Properties Inc', entityType: 'Corporation' }
                ]);
            }
        }
    }, [isOpen, token]);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         if (token?.startsWith('demo-jwt-token')) {
    //             await new Promise(resolve => setTimeout(resolve, 1000));
    //             alert('Demo: Invitation would be sent to ' + formData.email);
    //         } else {
    //             await apiService.request('/users/invite', {
    //                 method: 'POST',
    //                 body: JSON.stringify(formData),
    //             }, token);
    //             alert('Invitation sent successfully!');
    //         }

    //         onSuccess();
    //         onClose();
    //         setFormData({
    //             email: '',
    //             firstName: '',
    //             lastName: '',
    //             role: 'PROPERTY_MANAGER',
    //             entityIds: [],
    //             propertyIds: [],
    //         });
    //     } catch (error) {
    //         console.error('Failed to invite user:', error);
    //         alert('Failed to send invitation. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (token?.startsWith('demo-jwt-token')) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Demo: Invitation would be sent to ' + formData.email);
            } else {
                // Use the real invitation service
                const { invitationService } = await import('../../services/api/invitationService');
                await invitationService.inviteUser({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    entityIds: formData.entityIds,
                    propertyIds: formData.propertyIds
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
            alert(error instanceof Error ? error.message : 'Failed to send invitation. Please try again.');
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
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                    Invite New User
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Entity Access (Optional)</label>
                            <div style={{
                                maxHeight: '8rem',
                                overflowY: 'auto',
                                background: 'rgba(249, 250, 251, 0.5)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem'
                            }}>
                                {entities.map(entity => (
                                    <label key={entity.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                                                borderColor: '#d1d5db',
                                                color: '#6366f1'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                                            {entity.name} ({entity.entityType})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ flex: 1, opacity: loading ? 0.5 : 1 }}
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};