export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  entities?: UserEntity[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  ENTITY_MANAGER = 'ENTITY_MANAGER',
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  TENANT = 'TENANT',
  MAINTENANCE = 'MAINTENANCE',
  ACCOUNTANT = 'ACCOUNTANT',
}

export interface UserEntity {
  id: string;
  name: string;
  type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
