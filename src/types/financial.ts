// src/types/financial.ts

export interface FinancialMetrics {
    totalReceivables: number;
    outstandingInvoices: number;
    unappliedPayments: number;
    overdueAmount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    totalAmount: number;
    balanceAmount: number;
    paidAmount: number;
    dueDate: string;
    status: InvoiceStatus;
    issueDate: string;
    description?: string;
    lineItems?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Payment {
    id: string;
    paymentNumber: string;
    payerName: string;
    amount: number;
    paymentDate: string;
    status: PaymentStatus;
    availableAmount?: number;
    description?: string;
    paymentMethod?: PaymentMethod;
}

export interface PaymentApplication {
    id: string;
    paymentId: string;
    invoiceId: string;
    appliedAmount: number;
    applicationDate: string;
    status: 'PENDING' | 'APPLIED' | 'REVERSED';
}

export interface MatchingSuggestion {
    invoiceId: string;
    paymentId: string;
    matchConfidence: number;
    suggestedAmount: number;
    reason: string;
}

export type InvoiceStatus =
    | 'DRAFT'
    | 'SENT'
    | 'PARTIAL_PAYMENT'
    | 'PAID'
    | 'OVERDUE'
    | 'VOID';

export type PaymentStatus =
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED';

export type PaymentMethod =
    | 'CASH'
    | 'CHECK'
    | 'CREDIT_CARD'
    | 'ACH'
    | 'WIRE_TRANSFER'
    | 'ONLINE_PAYMENT';

export interface InvoiceFilters {
    status?: InvoiceStatus[];
    dateRange?: {
        start: string;
        end: string;
    };
    customerName?: string;
    amountRange?: {
        min: number;
        max: number;
    };
}

export interface PaymentFilters {
    status?: PaymentStatus[];
    dateRange?: {
        start: string;
        end: string;
    };
    payerName?: string;
    paymentMethod?: PaymentMethod[];
    amountRange?: {
        min: number;
        max: number;
    };
}