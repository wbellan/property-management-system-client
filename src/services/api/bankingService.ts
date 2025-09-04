// src/services/api/bankingService.ts
import { BaseApiService } from "./baseApiService";

// Types for Banking API
export interface BankAccount {
    id: string;
    entityId: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'CD' | 'INVESTMENT';
    routingNumber?: string;
    currentBalance: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

export interface CreateBankAccountData {
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'CD' | 'INVESTMENT';
    routingNumber?: string;
    notes?: string;
}

export interface UpdateBankAccountData {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    accountType?: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'CD' | 'INVESTMENT';
    routingNumber?: string;
    notes?: string;
}

export interface BankAccountDetails extends BankAccount {
    recentTransactions: Array<{
        id: string;
        description: string;
        amount: number;
        transactionDate: string;
        transactionType: 'DEBIT' | 'CREDIT';
    }>;
    totalTransactions: number;
}

export interface ChartAccount {
    id: string;
    entityId: string;
    accountCode: string;
    accountName: string;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    parentId?: string;
    description?: string;
    isActive: boolean;
    currentBalance?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateChartAccountData {
    accountCode: string;
    accountName: string;
    description?: string;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    parentId?: string;
}

// LEDGER ENTRY INTERFACES - FIXED TO MATCH YOUR ACTUAL DTO
export interface LedgerEntryLine {
    id: string;
    chartAccountId: string;
    entryType: 'DEBIT' | 'CREDIT';
    amount: number;
    description?: string;
    chartAccount?: ChartAccount;
}

// FIXED - Match your actual backend structure
export interface LedgerEntry {
    id: string;
    entityId: string;
    bankLedgerId: string;
    chartAccountId: string;
    transactionType: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
    transactionDate: string;
    referenceNumber?: string;
    referenceId?: string;
    entryType: string;
    debitAmount: string;
    creditAmount: string;
    createdAt: string;
    updatedAt: string;
    // Relations
    bankLedger?: {
        id: string;
        accountName: string;
    };
    chartAccount?: {
        id: string;
        accountCode: string;
        accountName: string;
        accountType: string;
    };
}

// This exactly matches your backend CreateMultipleLedgerEntriesDto
export interface CreateMultipleLedgerEntriesDto {
    entries: Array<{
        bankLedgerId: string;
        chartAccountId: string;
        entryType: 'MANUAL' | 'PAYMENT' | 'TRANSFER' | 'ADJUSTMENT' | 'INTEREST' | 'FEE';
        description: string;
        debitAmount: string;
        creditAmount: string;
        transactionDate: string;
        referenceId?: string;
        referenceNumber?: string;
    }>;
    transactionDescription: string;
}

// Simplified interface for frontend use
export interface CreateLedgerEntryData {
    transactionDate: string;
    description: string;
    referenceNumber?: string;
    notes?: string;
    entries: Array<{
        chartAccountId: string;
        entryType: 'DEBIT' | 'CREDIT';
        amount: number;
        description?: string;
    }>;
}

export interface BankTransaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    referenceNumber: string | null;
    transactionType: 'DEBIT' | 'CREDIT';
    runningBalance: number | null;
    bankAccountId: string;
    statementReference: string | null;
    createdAt: string;
}

export interface BankTransactionsResponse {
    data: BankTransaction[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    meta: {
        bankAccountId: string;
        entityId: string;
        dateRange: {
            start: string | null;
            end: string | null;
        };
    };
}

export interface GetBankTransactionsParams {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}


/**
 * Banking Service using BaseApiService
 */
export class BankingService extends BaseApiService {

    // ===============================
    // BANK ACCOUNT OPERATIONS
    // ===============================

    async getBankAccounts(entityId: string, includeInactive = false, token?: string) {
        const queryString = this.buildQueryString({ includeInactive });
        return this.get(`/entities/${entityId}/bank-accounts${queryString}`, token);
    }

    async getBankAccountDetails(entityId: string, bankId: string, token?: string) {
        return this.get(`/entities/${entityId}/bank-accounts/${bankId}`, token);
    }

    async createBankAccount(entityId: string, accountData: CreateBankAccountData, token?: string) {
        return this.post(`/entities/${entityId}/bank-accounts`, accountData, token);
    }

    async updateBankAccount(entityId: string, bankId: string, accountData: UpdateBankAccountData, token?: string) {
        return this.patch(`/entities/${entityId}/bank-accounts/${bankId}`, accountData, token);
    }

    async deactivateBankAccount(entityId: string, bankId: string, token?: string) {
        return this.delete(`/entities/${entityId}/bank-accounts/${bankId}`, token);
    }

    async getBankAccountBalance(entityId: string, bankId: string, token?: string) {
        return this.get(`/entities/${entityId}/bank-accounts/${bankId}/balance`, token);
    }

    // ===============================
    // CHART OF ACCOUNTS OPERATIONS
    // ===============================

    async getChartAccounts(entityId: string, token?: string): Promise<ChartAccount[]> {
        return this.get(`/entities/${entityId}/chart-accounts`, token);
    }

    async getChartAccountsTree(entityId: string, token?: string): Promise<ChartAccount[]> {
        return this.get(`/entities/${entityId}/chart-accounts/tree`, token);
    }

    async createChartAccount(entityId: string, accountData: CreateChartAccountData, token?: string): Promise<ChartAccount> {
        return this.post(`/entities/${entityId}/chart-accounts`, accountData, token);
    }

    async updateChartAccount(entityId: string, accountId: string, accountData: Partial<CreateChartAccountData>, token?: string): Promise<ChartAccount> {
        console.log('accountData for update chart account', accountData);
        return this.patch(`/entities/${entityId}/chart-accounts/${accountId}`, accountData, token);
    }

    async deactivateChartAccount(entityId: string, accountId: string, token?: string) {
        return this.delete(`/entities/${entityId}/chart-accounts/${accountId}`, token);
    }

    async setupDefaultChartAccounts(entityId: string, token?: string) {
        return this.post(`/entities/${entityId}/chart-accounts/setup-default`, {}, token);
    }

    // ===============================
    // LEDGER ENTRY OPERATIONS - PROPERLY FIXED
    // ===============================

    async getLedgerEntries(entityId: string, options: any = {}, token?: string): Promise<LedgerEntry[]> {
        const queryString = this.buildQueryString(options);
        return this.get(`/entities/${entityId}/ledger-entries${queryString}`, token);
    }

    /**
     * Create multiple ledger entries (double-entry bookkeeping)
     * Converts frontend format to backend DTO and uses proper BaseApiService method
     */
    async createLedgerEntry(entityId: string, entryData: CreateLedgerEntryData, bankAccountId: string, token?: string): Promise<LedgerEntry[]> {
        // Convert frontend format to backend DTO format that matches your actual DTO
        const backendDto: CreateMultipleLedgerEntriesDto = {
            entries: entryData.entries.map(entry => ({
                bankLedgerId: bankAccountId,
                chartAccountId: entry.chartAccountId,
                entryType: 'MANUAL' as const, // From your DTO enum
                description: entry.description || entryData.description,
                debitAmount: entry.entryType === 'DEBIT' ? entry.amount.toString() : '0',
                creditAmount: entry.entryType === 'CREDIT' ? entry.amount.toString() : '0',
                transactionDate: entryData.transactionDate,
                referenceId: entryData.referenceNumber || undefined,
                referenceNumber: entryData.referenceNumber || undefined
            })),
            transactionDescription: entryData.description
        };

        // Use your existing BaseApiService post method
        return this.post(`/entities/${entityId}/ledger-entries/multiple`, backendDto, token);
    }

    /**
     * Update ledger entry - placeholder for when backend implements it
     */
    async updateLedgerEntry(entityId: string, entryId: string, entryData: CreateLedgerEntryData, token?: string): Promise<LedgerEntry> {
        throw new Error('Update ledger entry is not yet implemented in the backend API');
    }

    /**
     * Delete ledger entry - uses your existing BaseApiService
     */
    async deleteLedgerEntry(entityId: string, entryId: string, token?: string) {
        return this.delete(`/entities/${entityId}/ledger-entries/${entryId}`, token);
    }

    // ===============================
    // SIMPLE PAYMENT OPERATIONS
    // ===============================

    /**
     * Record a simple payment (automatically creates ledger entries)
     */
    async recordSimplePayment(
        entityId: string,
        paymentData: {
            bankAccountId: string;
            accountId: string;
            amount: string;
            description: string;
            transactionDate: string;
            transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'TRANSFER';
            referenceNumber?: string;
        },
        token?: string
    ): Promise<LedgerEntry[]> {
        return this.post(`/entities/${entityId}/ledger-entries/simple`, paymentData, token);
    }

    // ===============================
    // PAYMENT INTEGRATION OPERATIONS
    // ===============================

    // Record a single payment
    async recordPayment(entityId: string, paymentData: any, token?: string) {
        return this.post(`/entities/${entityId}/payments/record`, paymentData, token);
    }

    // Record a check deposit with multiple checks
    async recordCheckDeposit(entityId: string, depositData: any, token?: string) {
        return this.post(`/entities/${entityId}/payments/checks`, depositData, token);
    }

    // Record a batch payment deposit
    async recordPaymentBatch(entityId: string, batchData: any, token?: string) {
        return this.post(`/entities/${entityId}/payments/batch`, batchData, token);
    }

    // Get unreconciled payments
    async getUnreconciledPayments(entityId: string, filters: any = {}, token?: string) {
        const queryString = this.buildQueryString(filters);
        return this.get(`/entities/${entityId}/payments/pending${queryString}`, token);
    }

    // Reconcile a payment with bank statement
    async reconcilePayment(entityId: string, paymentId: string, reconcileData: any, token?: string) {
        return this.post(`/entities/${entityId}/payments/${paymentId}/reconcile`, reconcileData, token);
    }

    // Generate a receipt for a payment
    async generateReceipt(entityId: string, paymentId: string, receiptData: any, token?: string) {
        return this.post(`/entities/${entityId}/payments/${paymentId}/receipt`, receiptData, token);
    }

    // Get available payment methods
    async getPaymentMethods(entityId: string, token?: string) {
        return this.get(`/entities/${entityId}/payments/methods`, token);
    }

    // Get revenue accounts for payment categorization
    async getRevenueAccounts(entityId: string, token?: string) {
        return this.get(`/entities/${entityId}/payments/revenue-accounts`, token);
    }

    // Get payment details with ledger entries
    async getPaymentDetails(entityId: string, paymentId: string, token?: string) {
        return this.get(`/entities/${entityId}/payments/${paymentId}/details`, token);
    }

    // Search for invoices to link to payments
    async searchInvoicesForPayment(entityId: string, searchTerm: string, token?: string) {
        const queryString = this.buildQueryString({ search: searchTerm });
        return this.get(`/entities/${entityId}/invoices/search${queryString}`, token);
    }

    // Link existing payment to invoice
    async linkPaymentToInvoice(entityId: string, paymentId: string, invoiceId: string, token?: string) {
        return this.patch(`/entities/${entityId}/payments/${paymentId}/link-invoice`, { invoiceId }, token);
    }

    // Add these methods to your existing BankingService class

    /**
     * WORKFLOW 1: Record payment against a specific invoice
     */
    async recordInvoicePayment(entityId: string, paymentData: {
        invoiceId: string;
        bankAccountId: string;
        amount: string;
        paymentMethod: 'CHECK' | 'ACH' | 'CASH' | 'CREDIT_CARD' | 'WIRE_TRANSFER';
        paymentDate: string;
        payerName: string;
        referenceNumber?: string;
        description?: string;
    }, token?: string) {
        console.log('💳 Recording invoice payment:', paymentData);

        return this.post(`/entities/${entityId}/payments/record`, {
            ...paymentData,
            paymentType: paymentData.paymentMethod,
            createApplication: true // This tells backend to link to invoice
        }, token);
    }

    /**
     * WORKFLOW 2: Record general deposit (no invoice)
     */
    async recordGeneralDeposit(entityId: string, depositData: {
        bankAccountId: string;
        revenueAccountId: string;
        amount: string;
        paymentMethod: 'CHECK' | 'ACH' | 'CASH' | 'WIRE_TRANSFER' | 'DEPOSIT';
        paymentDate: string;
        description: string;
        referenceNumber?: string;
        payerName?: string;
    }, token?: string) {
        console.log('🏦 Recording general deposit:', depositData);

        return this.post(`/entities/${entityId}/ledger-entries/simple`, {
            bankAccountId: depositData.bankAccountId,
            accountId: depositData.revenueAccountId,
            amount: depositData.amount,
            description: depositData.description,
            transactionDate: depositData.paymentDate,
            transactionType: 'DEPOSIT',
            referenceNumber: depositData.referenceNumber
        }, token);
    }

    /**
     * Get outstanding invoices for payment application
     */
    async getOutstandingInvoices(entityId: string, filters?: {
        tenantId?: string;
        customerName?: string;
        limit?: number;
    }, token?: string) {
        const queryString = this.buildQueryString(filters || {});
        return this.get(`/entities/${entityId}/invoices/outstanding${queryString}`, token);
    }

    // Get Bank Transactions
    async getBankTransactions(
        entityId: string,
        accountId: string,
        params?: GetBankTransactionsParams,
        token?: string
    ): Promise<BankTransactionsResponse> {
        const queryString = this.buildQueryString(params || {});
        return this.get(`/entities/${entityId}/bank-accounts/${accountId}/transactions${queryString}`, token);
    }
}

export const bankingService = new BankingService();