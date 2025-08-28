// src/components/financial/index.ts

export { default as FinancialDashboard } from './FinancialDashboard';
export { default as InvoiceManagement } from './InvoiceManagement';
export { default as PaymentApplicationInterface } from './PaymentApplicationInterface';
export { default as FinancialNavigation } from './FinancialNavigation';
export { default as FinancialLayoutWrapper } from './FinancialLayoutWrapper';

// Re-export types for convenience
export type {
    FinancialMetrics,
    Invoice,
    Payment,
    PaymentApplication,
    MatchingSuggestion,
    InvoiceStatus,
    PaymentStatus,
    PaymentMethod,
    InvoiceFilters,
    PaymentFilters
} from '../../types/financial';