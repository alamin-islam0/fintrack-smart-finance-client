import { api } from './client';
import { Transaction } from './transactions';

export interface User {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  createdAt?: string;
}

export interface AdminReport {
  totalUsers: number;
  totalTransactions: number;
  totalTips: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryStats: Record<string, number>;
  monthlyStats: Array<{ monthKey: string; income: number; expense: number }>;
  savingsSummary: { target: number; current: number };
}

export interface CreateCategoryPayload {
  name: string;
  type: 'income' | 'expense';
}

export interface CreateTipPayload {
  title: string;
  content: string;
}

export const adminApi = {
  users: () => api.get<User[]>('/admin/users'),
  updateUserRole: (id: string, role: 'admin' | 'user') => api.put<User>(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  categories: () => api.get<Category[]>('/admin/categories'),
  createCategory: (payload: CreateCategoryPayload) => api.post<Category>('/admin/categories', payload),
  updateCategory: (id: string, payload: Partial<CreateCategoryPayload>) =>
    api.put<Category>(`/admin/categories/${id}`, payload),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),

  reports: () => api.get<AdminReport>('/admin/reports'),
  allTransactions: () => api.get<Transaction[]>('/admin/transactions'),

  createTip: (payload: CreateTipPayload) => api.post('/admin/tips', payload)
};
