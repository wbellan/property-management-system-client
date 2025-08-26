// src/types/entity.ts

/**
 * Main Entity interface matching your Prisma schema
 */
export interface Entity {
    id: string;
    name: string;
    legalName: string;
    entityType: string;
    organizationId: string;
    address?: string;
    phone?: string;
    email?: string;
    fax?: string;
    website?: string;
    taxId?: string;
    description?: string;
    isActive: boolean;
    isVerified?: boolean; // EIN/Tax ID verification status
    verifiedAt?: Date | string; // When verification was completed
    createdAt: Date | string;
    updatedAt: Date | string;

    // Relations
    organization: {
        id: string;
        name: string;
    };

    // Counts from your existing service
    _count: {
        properties: number;
        bankLedgers: number;
    };
}

/**
 * Entity statistics interface matching your getEntityStats response
 */
export interface EntityStats {
    entity: {
        id: string;
        name: string;
    };
    stats: {
        totalProperties: number;
        totalSpaces: number;
        activeLeases: number;
        totalBankLedgers: number;
        totalBalance: number;
        monthlyRentRoll: number;
        occupancyRate: number;
    };
}

/**
 * Query parameters for entity search and filtering
 */
export interface EntityQuery {
    page?: number;
    limit?: number;
    search?: string;
    entityType?: string;
    status?: string;
}

/**
 * DTO for creating new entities
 */
export interface CreateEntityDto {
    name: string;
    legalName: string;
    entityType: string;
    organizationId: string;
    address?: string;
    phone?: string;
    email?: string;
    fax?: string;
    website?: string;
    taxId?: string;
    description?: string;
    isActive?: boolean;
}

/**
 * DTO for updating entities
 */
export interface UpdateEntityDto extends Partial<CreateEntityDto> {
    // All fields from CreateEntityDto are optional for updates
}

/**
 * EIN/Tax ID verification response
 */
export interface EinVerificationResponse {
    isValid: boolean;
    businessName?: string;
    businessAddress?: string;
    businessType?: string;
    status?: string;
    message?: string;
}

/**
 * Entity type options
 */
export const ENTITY_TYPES = [
    'LLC',
    'Corporation',
    'Partnership',
    'Sole Proprietorship',
    'Trust',
    'Other'
] as const;

export type EntityType = typeof ENTITY_TYPES[number];

/**
 * Entity status options
 */
export const ENTITY_STATUSES = [
    'active',
    'inactive'
] as const;

export type EntityStatus = typeof ENTITY_STATUSES[number];