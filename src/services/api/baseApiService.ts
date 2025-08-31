// src/services/api/baseApiService.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Base API service class with common functionality
 * All other API services should extend this class
 */
export abstract class BaseApiService {
    protected baseUrl = API_BASE;

    /**
     * Get authentication headers with optional token override
     */
    protected getAuthHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authToken = token || localStorage.getItem('propflow_token');
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        }

        return headers;
    }

    /**
     * Make an authenticated API request
     */
    protected async request<T>(
        endpoint: string,
        options: RequestInit = {},
        token?: string
    ): Promise<T> {
        const config: RequestInit = {
            headers: this.getAuthHeaders(token),
            ...options,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Make a GET request
     */
    protected async get<T>(endpoint: string, token?: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, token);
    }

    /**
     * Make a POST request
     */
    protected async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }, token);
    }

    /**
     * Make a PATCH request
     */
    protected async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }, token);
    }

    /**
     * Make a PUT request
     */
    protected async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }, token);
    }

    /**
     * Make a DELETE request
     */
    protected async delete<T>(endpoint: string, token?: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, token);
    }

    /**
     * Build query string from parameters
     */
    protected buildQueryString(params: Record<string, any>): string {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.set(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return queryString ? `?${queryString}` : '';
    }
}

// Example of how to refactor existing services:

/**
 * Refactored Invitation Service using BaseApiService
 */
export class InvitationService extends BaseApiService {
    /**
     * Send user invitation
     */
    async inviteUser(inviteData: any, token?: string) {
        return this.post('/users/invite', inviteData, token);
    }

    /**
     * Validate invitation token (public endpoint)
     */
    async validateInvitation(token: string) {
        // For public endpoints, we don't use the base request method
        const response = await fetch(`${this.baseUrl}/users/validate-invitation/${token}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
    async completeInvitation(completeData: any) {
        // For public endpoints, we don't use the base request method
        const response = await fetch(`${this.baseUrl}/users/complete-invitation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        return this.post(`/users/${invitationId}/resend-invitation`, undefined, token);
    }

    /**
     * Get organization invitations
     */
    async getOrganizationInvitations(organizationId: string, token?: string) {
        return this.get(`/users/organization/${organizationId}/invitations`, token);
    }

    /**
     * Cancel invitation
     */
    async cancelInvitation(invitationId: string, token?: string) {
        return this.post(`/users/invitations/${invitationId}/cancel`, undefined, token);
    }
}

// /**
//  * Refactored Banking Service using BaseApiService
//  */
// export class BankingService extends BaseApiService {
//     // Bank Account Operations
//     async getBankAccounts(entityId: string, includeInactive = false, token?: string) {
//         const queryString = this.buildQueryString({ includeInactive });
//         return this.get(`/entities/${entityId}/banks${queryString}`, token);
//     }

//     async getBankAccountDetails(entityId: string, bankId: string, token?: string) {
//         return this.get(`/entities/${entityId}/banks/${bankId}`, token);
//     }

//     async createBankAccount(entityId: string, accountData: any, token?: string) {
//         return this.post(`/entities/${entityId}/banks`, accountData, token);
//     }

//     async updateBankAccount(entityId: string, bankId: string, accountData: any, token?: string) {
//         return this.patch(`/entities/${entityId}/banks/${bankId}`, accountData, token);
//     }

//     async deactivateBankAccount(entityId: string, bankId: string, token?: string) {
//         return this.delete(`/entities/${entityId}/banks/${bankId}`, token);
//     }

//     // Chart of Accounts Operations
//     async getChartAccounts(entityId: string, token?: string) {
//         return this.get(`/entities/${entityId}/chart-accounts`, token);
//     }

//     async createChartAccount(entityId: string, accountData: any, token?: string) {
//         return this.post(`/entities/${entityId}/chart-accounts`, accountData, token);
//     }

//     // Ledger Entry Operations
//     async getLedgerEntries(entityId: string, options: any = {}, token?: string) {
//         const queryString = this.buildQueryString(options);
//         return this.get(`/entities/${entityId}/ledger-entries${queryString}`, token);
//     }

//     async createLedgerEntries(entityId: string, entryData: any, token?: string) {
//         return this.post(`/entities/${entityId}/ledger-entries`, entryData, token);
//     }
// }

// Export singleton instances
export const invitationService = new InvitationService();
// export const bankingService = new BankingService();