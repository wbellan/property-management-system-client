// src/services/api/entitiesService.ts
import { apiService } from './apiService';
import type { Entity, EntityQuery, CreateEntityDto, UpdateEntityDto, EntityStats, EinVerificationResponse } from '../../types/entity';

export interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export const entitiesService = {
    /**
     * Get all entities with optional query parameters
     */
    async getEntities(query: EntityQuery = {}): Promise<ApiResponse<Entity[]>> {
        try {
            const params = new URLSearchParams();

            if (query.page) params.append('page', query.page.toString());
            if (query.limit) params.append('limit', query.limit.toString());
            if (query.search) params.append('search', query.search);
            if (query.entityType) params.append('entityType', query.entityType);
            if (query.status) params.append('status', query.status);

            const queryString = params.toString();
            const endpoint = queryString ? `/entities?${queryString}` : '/entities';

            return await apiService.request<Entity[]>(endpoint);
        } catch (error) {
            console.error('Error fetching entities:', error);
            throw error;
        }
    },

    /**
     * Get entity by ID
     */
    async getEntityById(id: string): Promise<ApiResponse<Entity>> {
        try {
            return await apiService.request<Entity>(`/entities/${id}`);
        } catch (error) {
            console.error('Error fetching entity:', error);
            throw error;
        }
    },

    /**
     * Get entity statistics
     */
    async getEntityStats(id: string): Promise<ApiResponse<EntityStats>> {
        try {
            return await apiService.request<EntityStats>(`/entities/${id}/stats`);
        } catch (error) {
            console.error('Error fetching entity stats:', error);
            throw error;
        }
    },

    /**
     * Create new entity
     */
    async createEntity(data: CreateEntityDto): Promise<ApiResponse<Entity>> {
        try {
            return await apiService.request<Entity>('/entities', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error creating entity:', error);
            throw error;
        }
    },

    /**
     * Update existing entity
     */
    async updateEntity(id: string, data: UpdateEntityDto): Promise<ApiResponse<Entity>> {
        try {
            return await apiService.request<Entity>(`/entities/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error updating entity:', error);
            throw error;
        }
    },

    /**
     * Delete entity
     */
    async deleteEntity(id: string): Promise<ApiResponse<{ message: string }>> {
        try {
            return await apiService.request<{ message: string }>(`/entities/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting entity:', error);
            throw error;
        }
    },

    /**
     * Verify EIN/Tax ID for an entity
     * This calls an external API to validate the EIN against IRS records
     */
    async verifyEIN(ein: string): Promise<ApiResponse<EinVerificationResponse>> {
        try {
            return await apiService.request<EinVerificationResponse>('/entities/verify-ein', {
                method: 'POST',
                body: JSON.stringify({ ein }),
            });
        } catch (error) {
            console.error('Error verifying EIN:', error);
            throw error;
        }
    },

    /**
     * Mark entity as EIN verified
     * This updates the entity's verification status after successful EIN check
     */
    async markEntityVerified(id: string, verificationData: EinVerificationResponse): Promise<ApiResponse<Entity>> {
        try {
            return await apiService.request<Entity>(`/entities/${id}/verify`, {
                method: 'PATCH',
                body: JSON.stringify({
                    isVerified: true,
                    verifiedAt: new Date().toISOString(),
                    verificationData
                }),
            });
        } catch (error) {
            console.error('Error marking entity as verified:', error);
            throw error;
        }
    }
};