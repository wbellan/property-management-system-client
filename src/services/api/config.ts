export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VALIDATE: '/auth/validate',
  REFRESH: '/auth/refresh',

  // Dashboard
  DASHBOARD_METRICS: '/reports/dashboard',

  // Properties
  PROPERTIES: '/properties',
  PROPERTY_STATS: '/properties/:id/stats',

  // Tenants
  TENANTS: '/tenants',
  TENANT_DETAILS: '/tenants/:id',

  // Leases
  LEASES: '/leases',
  LEASE_DETAILS: '/leases/:id',
  LEASE_RENEW: '/leases/:id/renew',
  LEASE_RENT_INCREASE: '/leases/:id/rent-increase',

  // Maintenance
  MAINTENANCE_REQUESTS: '/maintenance/requests',
  MAINTENANCE_VENDORS: '/maintenance/vendors',
  MAINTENANCE_ASSIGN: '/maintenance/requests/:id/assign',

  // Reports
  REPORTS: '/reports',
  PROFIT_LOSS: '/reports/profit-loss',
  CASH_FLOW: '/reports/cash-flow',
  OCCUPANCY: '/reports/occupancy',
  RENT_ROLL: '/reports/rent-roll',
  LEASE_EXPIRATION: '/reports/lease-expiration',
  MAINTENANCE_ANALYTICS: '/reports/maintenance-analytics',
  TENANT_ANALYTICS: '/reports/tenant-analytics',
  PORTFOLIO_OVERVIEW: '/reports/portfolio-overview',

  // Organizations
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_STATS: '/organizations/:id/stats',

  // Entities
  ENTITIES: '/entities',
  ENTITY_STATS: '/entities/:id/stats',

  // Users
  USERS: '/users',
  USER_ORGANIZATION: '/users/organization/:id',
  USER_INVITE: '/users/invite',
  USER_COMPLETE_INVITATION: '/users/complete-invitation',
  USER_SETUP_ORGANIZATION: '/users/setup-organization',
  USER_RESEND_INVITATION: '/users/:id/resend-invitation',
  USER_ACCESS_OPTIONS: '/users/access-options/:id',

  // Financial
  FINANCIALS: '/financials',
  BANK_LEDGERS: '/financials/bank-ledgers',
  CHART_ACCOUNTS: '/financials/chart-accounts',
  INVOICES: '/financials/invoices',
  PAYMENTS: '/financials/payments',
  FINANCIAL_SUMMARY: '/financials/reports/summary/:entityId',
};