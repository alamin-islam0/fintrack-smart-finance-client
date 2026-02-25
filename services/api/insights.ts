import { api } from './client';

export interface InsightData {
  noData: boolean;
  spendingTrend?: string;
  highestExpenseCategory?: string;
  savingsRate?: number;
  monthlySummary?: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  monthlyBreakdown?: Array<{
    monthKey: string;
    income: number;
    expense: number;
    balance: number;
  }>;
  recommendations?: string[];
  tips?: Array<{
    _id?: string;
    title: string;
    content: string;
  }>;
}

export const insightsApi = {
  getInsights: () => api.get<InsightData>('/insights')
};
