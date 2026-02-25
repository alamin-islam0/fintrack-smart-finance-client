import { api } from './client';

export interface Bill {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  status: 'pending' | 'paid';
}

export interface BillPayload {
  title: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  status?: 'pending' | 'paid';
}

export const billsApi = {
  all: (status?: 'pending' | 'paid') => api.get<Bill[]>('/bills', { params: status ? { status } : undefined }),
  create: (payload: BillPayload) => api.post<Bill>('/bills', payload),
  update: (id: string, payload: Partial<BillPayload>) => api.put<Bill>(`/bills/${id}`, payload),
  remove: (id: string) => api.delete(`/bills/${id}`)
};
