import { api } from './client';

export interface SavingsGoal {
  _id: string;
  user: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  contributions: Array<{ amount: number; date?: string }> | [];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGoalPayload {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
  contribution?: number;
}

export const goalsApi = {
  all: () => api.get<SavingsGoal[]>('/goals'),
  
  create: (payload: CreateGoalPayload) =>
    api.post<SavingsGoal>('/goals', payload),
  
  update: (id: string, payload: Partial<CreateGoalPayload>) =>
    api.put<SavingsGoal>(`/goals/${id}`, payload),
  
  remove: (id: string) => api.delete(`/goals/${id}`)
};
