// src/services/api/invitationService.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface InviteUserData {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    entityIds?: string[];
    propertyIds?: string[];
}

export interface CompleteInvitationData {
    token: string;
    password: string;
}

export interface InvitationDetails {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organizationName: string;
    expiresAt: string;
}

export interface PendingInvitation {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    expiresAt: string;
    invitedBy: {
        firstName: string;
        lastName: string;
    };
}

class InvitationService {
    private getAuthHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authToken = token || localStorage.getItem('propflow_token');
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        }

        return headers;
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {},
        token?: string
    ): Promise<T> {
        const config: RequestInit = {
            headers: this.getAuthHeaders(token),
            ...options,
        };

        const response = await fetch(`${API_BASE}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Send user invitation
     */
    async inviteUser(inviteData: InviteUserData, token?: string) {
        return this.request('/users/invite', {
            method: 'POST',
            body: JSON.stringify(inviteData),
        }, token);
    }

    /**
     * Validate invitation token (public endpoint)
     */
    async validateInvitation(token: string): Promise<{ success: boolean; data: InvitationDetails }> {
        const response = await fetch(`${API_BASE}/users/validate-invitation/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Complete invitation (public endpoint)
     */
    async completeInvitation(completeData: CompleteInvitationData) {
        const response = await fetch(`${API_BASE}/users/complete-invitation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(completeData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Resend invitation
     */
    async resendInvitation(invitationId: string, token?: string) {
        return this.request(`/users/${invitationId}/resend-invitation`, {
            method: 'POST',
        }, token);
    }

    /**
     * Get organization invitations
     */
    async getOrganizationInvitations(organizationId: string, token?: string): Promise<{ success: boolean; data: PendingInvitation[] }> {
        return this.request(`/users/organization/${organizationId}/invitations`, {}, token);
    }

    /**
     * Cancel invitation
     */
    async cancelInvitation(invitationId: string, token?: string) {
        return this.request(`/users/invitations/${invitationId}/cancel`, {
            method: 'POST',
        }, token);
    }
}

export const invitationService = new InvitationService();