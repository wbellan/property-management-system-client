// src/components/financial/index.ts

export { default as FinancialDashboard } from './dashboard/FinancialDashboard';
export { default as InvoiceManagement } from './invoices/InvoiceManagement';
export { default as PaymentApplicationInterface } from './payments/PaymentApplicationInterface';
export { default as FinancialNavigation } from './shared/FinancialNavigation';
export { default as FinancialLayoutWrapper } from './shared/FinancialLayoutWrapper';

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