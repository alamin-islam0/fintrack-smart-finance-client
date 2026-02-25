import { api } from './client';

export interface Budget {
  _id: string;
  category: string;
  month: string;
  limitAmount: number;
  spent?: number;
  remaining?: number;
  usagePercent?: number;
  status?: 'safe' | 'warning' | 'over';
}

export interface BudgetPayload {
  category: string;
  month: string;
  limitAmount: number;
}

export const budgetsApi = {
  all: (month?: string) => api.get<Budget[]>('/budgets', { params: month ? { month } : undefined }),
  create: (payload: BudgetPayload) => api.post<Budget>('/budgets', payload),
  update: (id: string, payload: Partial<BudgetPayload>) => api.put<Budget>(`/budgets/${id}`, payload),
  remove: (id: string) => api.delete(`/budgets/${id}`)
};
