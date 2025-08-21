// src/services/api/userAccessService.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

interface UpdateUserAccessData {
    role: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    entityIds?: string[];
    propertyIds?: string[];
}

interface UserAccessResponse {
    success: boolean;
    data: any;
    message?: string;
}

interface EntitiesPropertiesResponse {
    success: boolean;
    data: {
        entities: Array<{
            id: string;
            name: string;
            type: string;
        }>;
        properties: Array<{
            id: string;
            name: string;
            address: string;
            entityId: string;
        }>;
    };
}

class UserAccessService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('propflow_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: this.getAuthHeaders(),
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Update user access and permissions
     */
    async updateUserAccess(userId: string, data: UpdateUserAccessData): Promise<UserAccessResponse> {
        return this.request<UserAccessResponse>(`/users/${userId}/access`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * Get user access details
     */
    async getUserAccess(userId: string): Promise<UserAccessResponse> {
        return this.request<UserAccessResponse>(`/users/${userId}/access`);
    }

    /**
     * Get entities and properties for access management
     */
    async getEntitiesAndProperties(organizationId: string): Promise<EntitiesPropertiesResponse> {
        return this.request<EntitiesPropertiesResponse>(`/users/organization/${organizationId}/entities-properties`);
    }

    /**
     * Get all users in organization for access management
     */
    async getOrganizationUsers(organizationId: string): Promise<UserAccessResponse> {
        console.log('Getting users for org:', organizationId); // Add this
        return this.request<UserAccessResponse>(`/users/organization/${organizationId}`);
    }
}

export const userAccessService = new UserAccessService();
