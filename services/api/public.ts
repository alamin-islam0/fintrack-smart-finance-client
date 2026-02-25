import { api } from './client';

export interface LandingOverviewResponse {
  period: 'monthly' | 'yearly';
  metrics: {
    totalBalance: number;
    monthlySavings: number;
    netWorth: number;
    totalBalanceChange: number;
    monthlySavingsChange: number;
    netWorthChange: number;
  };
  distribution: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export const publicApi = {
  overview: (period: 'monthly' | 'yearly' = 'monthly') =>
    api.get<LandingOverviewResponse>('/public/overview', { params: { period } })
};
