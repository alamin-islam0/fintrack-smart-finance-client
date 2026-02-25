import { api } from './client';

export interface Transaction {
  _id: string;
  user: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionPayload {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBalance?: number;
}

export interface MonthlyTrend {
  monthKey: string;
  label: string;
  income: number;
  expense: number;
  total: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
}

export interface DashboardDataResponse {
  summary: TransactionSummary;
  trends: MonthlyTrend[];
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryBreakdown[];
  transactionCount: number;
}

export const transactionApi = {
  all: (params?: {
    category?: string;
    type?: 'income' | 'expense';
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  }) => api.get<Transaction[]>('/transactions', { params }),

  create: (payload: CreateTransactionPayload) => api.post<Transaction>('/transactions', payload),

  update: (id: string, payload: CreateTransactionPayload) => api.put<Transaction>(`/transactions/${id}`, payload),

  remove: (id: string) => api.delete(`/transactions/${id}`),

  summary: () => api.get<TransactionSummary>('/transactions/summary'),

  trends: () => api.get<MonthlyTrend[]>('/transactions/trends'),

  dashboard: (params?: { recentLimit?: number }) => api.get<DashboardDataResponse>('/transactions/dashboard', { params })
};
