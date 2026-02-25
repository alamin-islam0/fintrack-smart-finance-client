import { api } from './client';

export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  createdAt?: string;
}

export const categoriesApi = {
  all: () => api.get<Category[]>('/categories')
};
