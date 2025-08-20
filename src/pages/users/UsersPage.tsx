// src/pages/users/UsersPage.tsx
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Settings, Mail, Shield, Building2, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';

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
    const { user, token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await apiService.request(
                `/users/organization/${user?.organizationId}`,
                {},
                token
            );
            setUsers(response.data || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="card hover:shadow-xl transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${u.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            u.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                'bg-gray-400'
                        }`}>
                        <span className="text-white font-medium text-sm">
                            {u.firstName[0]}{u.lastName[0]}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {u.firstName} {u.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{u.email}</p>
                        {u.tenantProfile && (
                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-purple-100 text-purple-800 mt-1">
                                Has Tenant Profile
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                    </button>
                    {u.isPendingInvite && (
                        <button
                            onClick={() => handleResendInvite(u.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Resend invitation"
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">{formatRole(u.role)}</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.isPendingInvite ? 'bg-yellow-100 text-yellow-800' :
                            u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                u.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                        }`}>
                        {u.isPendingInvite ? 'Pending Invite' :
                            u.status === 'ACTIVE' ? 'Active' :
                                u.status === 'PENDING' ? 'Pending Setup' : 'Inactive'}
                    </span>
                </div>
            </div>

            {u.entities.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Entity Access</p>
                    <div className="flex flex-wrap gap-1">
                        {u.entities.map(entity => (
                            <span key={entity.id} className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-800">
                                <Building2 className="w-3 h-3 mr-1" />
                                {entity.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    {u.lastLoginAt ? `Last login: ${new Date(u.lastLoginAt).toLocaleDateString()}` : 'Never logged in'}
                </span>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                    Manage Access
                </button>
            </div>
        </div>
    );

    const handleResendInvite = async (userId: string) => {
        try {
            await apiService.request(`/users/${userId}/resend-invitation`, { method: 'POST' }, token);
            // Show success toast
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
            'MAINTENANCE': 'Maintenance',
            'ACCOUNTANT': 'Accountant',
        };
        return roleNames[role] || role;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage team members, tenants, and their access levels</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Invite User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                    <option value="all">All Roles</option>
                    <option value="ORG_ADMIN">Organization Admin</option>
                    <option value="ENTITY_MANAGER">Entity Manager</option>
                    <option value="PROPERTY_MANAGER">Property Manager</option>
                    <option value="TENANT">Tenant</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="ACCOUNTANT">Accountant</option>
                </select>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            <p className="text-sm text-gray-600">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.status === 'ACTIVE').length}
                            </p>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.isPendingInvite).length}
                            </p>
                            <p className="text-sm text-gray-600">Pending Invites</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'TENANT').length}
                            </p>
                            <p className="text-sm text-gray-600">Tenants</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u) => (
                    <UserCard key={u.id} user={u} />
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                            ? 'Try adjusting your search filters or invite new users.'
                            : 'Get started by inviting your first team member.'
                        }
                    </p>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                    >
                        <UserPlus className="w-4 h-4 inline mr-2" />
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
        </div>
    );
};

// Enhanced Invite User Modal
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
            await apiService.request('/users/invite', {
                method: 'POST',
                body: JSON.stringify(formData),
            }, token);

            alert('Invitation sent successfully!');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Invite New User</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full px-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        >
                            <option value="ORG_ADMIN">Organization Admin</option>
                            <option value="ENTITY_MANAGER">Entity Manager</option>
                            <option value="PROPERTY_MANAGER">Property Manager</option>
                            <option value="MAINTENANCE">Maintenance Staff</option>
                            <option value="ACCOUNTANT">Accountant</option>
                        </select>
                    </div>

                    {entities.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Entity Access (Optional)</label>
                            <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50/50 rounded-xl p-3">
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
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">{entity.name} ({entity.entityType})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg"
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};