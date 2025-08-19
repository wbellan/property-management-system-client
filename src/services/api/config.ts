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
  
  // Dashboard
  DASHBOARD_METRICS: '/reports/dashboard',
  
  // Properties
  PROPERTIES: '/properties',
  PROPERTY_STATS: '/properties/:id/stats',
  
  // Reports
  REPORTS: '/reports',
  
  // Organizations
  ORGANIZATIONS: '/organizations',
  
  // Entities
  ENTITIES: '/entities',
};
