// src/services/api/bankingService.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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
    description?: string;
    accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    parentId?: string;
    isActive: boolean;
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

export interface LedgerEntry {
    id: string;
    bankLedgerId: string;
    chartAccountId: string;
    transactionType: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
    transactionDate: string;
    referenceNumber?: string;
    referenceId?: string;
    createdAt: string;
    bankLedger: {
        id: string;
        accountName: string;
    };
    chartAccount: {
        id: string;
        accountCode: string;
        accountName: string;
        accountType: string;
    };
}

export interface CreateLedgerEntryData {
    entries: Array<{
        bankLedgerId: string;
        chartAccountId: string;
        debitAmount: string;
        creditAmount: string;
        description: string;
    }>;
    transactionDate: string;
    transactionDescription: string;
    referenceId?: string;
    referenceNumber?: string;
}

class BankingService {
    private getAuthHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authToken = token || localStorage.getItem('propflow_token');
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        }

        return headers;
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {},
        token?: string
    ): Promise<T> {
        const config: RequestInit = {
            headers: this.getAuthHeaders(token),
            ...options,
        };

        const response = await fetch(`${API_BASE}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // ===============================
    // BANK ACCOUNT OPERATIONS
    // ===============================

    /**
     * Get all bank accounts for an entity
     */
    async getBankAccounts(entityId: string, includeInactive = false, token?: string): Promise<BankAccount[]> {
        return this.request(`/entities/${entityId}/bank-accounts?includeInactive=${includeInactive}`, {}, token);
    }

    /**
     * Get detailed bank account information with recent transactions
     */
    async getBankAccountDetails(entityId: string, bankId: string, token?: string): Promise<BankAccountDetails> {
        return this.request(`/entities/${entityId}/bank-accounts/${bankId}`, {}, token);
    }

    /**
     * Create a new bank account
     */
    async createBankAccount(entityId: string, accountData: CreateBankAccountData, token?: string): Promise<BankAccount> {
        return this.request(`/entities/${entityId}/bank-accounts`, {
            method: 'POST',
            body: JSON.stringify(accountData),
        }, token);
    }

    /**
     * Update an existing bank account
     */
    async updateBankAccount(entityId: string, bankId: string, accountData: UpdateBankAccountData, token?: string): Promise<BankAccount> {
        return this.request(`/entities/${entityId}/bank-accounts/${bankId}`, {
            method: 'PATCH',
            body: JSON.stringify(accountData),
        }, token);
    }

    /**
     * Deactivate a bank account (soft delete)
     */
    async deactivateBankAccount(entityId: string, bankId: string, token?: string): Promise<{ success: boolean; message: string }> {
        return this.request(`/entities/${entityId}/bank-accounts/${bankId}`, {
            method: 'DELETE',
        }, token);
    }

    /**
     * Get current balance of a bank account
     */
    async getBankAccountBalance(entityId: string, bankId: string, token?: string): Promise<{ balance: number; lastUpdated: string }> {
        return this.request(`/entities/${entityId}/bank-accounts/${bankId}/balance`, {}, token);
    }

    // ===============================
    // CHART OF ACCOUNTS OPERATIONS
    // ===============================

    /**
     * Get all chart of accounts for an entity
     */
    async getChartAccounts(entityId: string, token?: string): Promise<ChartAccount[]> {
        return this.request(`/entities/${entityId}/chart-accounts`, {}, token);
    }

    /**
     * Get hierarchical chart of accounts
     */
    async getChartAccountsTree(entityId: string, token?: string): Promise<ChartAccount[]> {
        return this.request(`/entities/${entityId}/chart-accounts/tree`, {}, token);
    }

    /**
     * Create a new chart account
     */
    async createChartAccount(entityId: string, accountData: CreateChartAccountData, token?: string): Promise<ChartAccount> {
        return this.request(`/entities/${entityId}/chart-accounts`, {
            method: 'POST',
            body: JSON.stringify(accountData),
        }, token);
    }

    /**
     * Update an existing chart account
     */
    async updateChartAccount(entityId: string, accountId: string, accountData: Partial<CreateChartAccountData>, token?: string): Promise<ChartAccount> {
        return this.request(`/entities/${entityId}/chart-accounts/${accountId}`, {
            method: 'PATCH',
            body: JSON.stringify(accountData),
        }, token);
    }

    /**
     * Deactivate a chart account
     */
    async deactivateChartAccount(entityId: string, accountId: string, token?: string): Promise<{ success: boolean; message: string }> {
        return this.request(`/entities/${entityId}/chart-accounts/${accountId}`, {
            method: 'DELETE',
        }, token);
    }

    /**
     * Create default chart of accounts for an entity
     */
    async createDefaultChart(entityId: string, token?: string): Promise<ChartAccount[]> {
        return this.request(`/entities/${entityId}/chart-accounts/default-setup`, {
            method: 'POST',
        }, token);
    }

    // ===============================
    // LEDGER ENTRY OPERATIONS
    // ===============================

    /**
     * Get ledger entries for an entity
     */
    async getLedgerEntries(
        entityId: string,
        options: {
            bankLedgerId?: string;
            chartAccountId?: string;
            limit?: number;
            offset?: number;
        } = {},
        token?: string
    ): Promise<{ entries: LedgerEntry[]; total: number }> {
        const queryParams = new URLSearchParams();
        if (options.bankLedgerId) queryParams.set('bankLedgerId', options.bankLedgerId);
        if (options.chartAccountId) queryParams.set('chartAccountId', options.chartAccountId);
        if (options.limit) queryParams.set('limit', options.limit.toString());
        if (options.offset) queryParams.set('offset', options.offset.toString());

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.request(`/entities/${entityId}/ledger-entries${queryString}`, {}, token);
    }

    /**
     * Create manual ledger entries (double-entry bookkeeping)
     */
    async createLedgerEntries(entityId: string, entryData: CreateLedgerEntryData, token?: string): Promise<LedgerEntry[]> {
        return this.request(`/entities/${entityId}/ledger-entries`, {
            method: 'POST',
            body: JSON.stringify(entryData),
        }, token);
    }

    /**
     * Validate double-entry bookkeeping for entries
     */
    async validateDoubleEntry(entityId: string, entries: any[], token?: string): Promise<{ isValid: boolean; errors: string[] }> {
        return this.request(`/entities/${entityId}/ledger-entries/validate`, {
            method: 'POST',
            body: JSON.stringify(entries),
        }, token);
    }

    // ===============================
    // PAYMENT INTEGRATION OPERATIONS
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
        return this.request(`/entities/${entityId}/ledger-entries/simple`, {
            method: 'POST',
            body: JSON.stringify(paymentData),
        }, token);
    }

    /**
     * Record a payment with automatic ledger entries
     */
    async recordPayment(
        entityId: string,
        paymentData: {
            payerName: string;
            amount: string;
            bankAccountId: string;
            incomeAccountId: string;
            paymentDate: string;
            paymentMethod: 'CASH' | 'CHECK' | 'ACH' | 'CREDIT_CARD' | 'BANK_TRANSFER';
            description: string;
            referenceId?: string;
            checkNumber?: string;
        },
        token?: string
    ): Promise<LedgerEntry[]> {
        return this.request(`/entities/${entityId}/ledger-entries/record-payment`, {
            method: 'POST',
            body: JSON.stringify(paymentData),
        }, token);
    }

    /**
     * Record a check deposit with multiple checks
     */
    async recordCheckDeposit(
        entityId: string,
        depositData: {
            bankAccountId: string;
            depositDate: string;
            checks: Array<{
                checkNumber: string;
                amount: string;
                payerName: string;
                incomeAccountId: string;
                memo?: string;
            }>;
            totalAmount: string;
        },
        token?: string
    ): Promise<LedgerEntry[]> {
        return this.request(`/entities/${entityId}/ledger-entries/check-deposits`, {
            method: 'POST',
            body: JSON.stringify(depositData),
        }, token);
    }
}

export const bankingService = new BankingService();