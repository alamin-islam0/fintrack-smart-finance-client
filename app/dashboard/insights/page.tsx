'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { insightsApi, InsightData } from '@/services/api/insights';

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await insightsApi.getInsights();
        setData(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <EmptyState title="Insights unavailable" description="Unable to fetch insight analytics right now." />;
  }

  if (data.noData) {
    return (
      <div className="space-y-4">
        <EmptyState title="No data yet" description="Start adding transactions to unlock personalized financial insights." />
        <div className="grid gap-4 md:grid-cols-2">
          {(data.tips || []).map((tip, index) => (
            <Card key={`${tip.title}-${index}`}>
              <h3 className="text-lg font-semibold">{tip.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{tip.content}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const monthlySummary = data.monthlySummary || {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Spending Trend</h3>
          <p className="mt-2 text-sm text-slate-500">{data.spendingTrend}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Highest Expense Category</h3>
          <p className="mt-2 text-sm text-slate-500">{data.highestExpenseCategory}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Savings Rate</h3>
          <p className="mt-2 text-3xl font-bold text-brand-secondary">{data.savingsRate}%</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Monthly Summary</h3>
          <p className="mt-2 text-sm text-slate-500">
            Income ${monthlySummary.totalIncome.toFixed(2)} | Expense ${monthlySummary.totalExpense.toFixed(2)} | Balance ${monthlySummary.balance.toFixed(2)}
          </p>
        </Card>
      </div>

      {!!data.monthlyBreakdown?.length && (
        <Card>
          <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Month</th>
                  <th className="py-2">Income</th>
                  <th className="py-2">Expense</th>
                  <th className="py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyBreakdown.map((row) => (
                  <tr key={row.monthKey} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2">{row.monthKey}</td>
                    <td className="py-2">${row.income.toFixed(2)}</td>
                    <td className="py-2">${row.expense.toFixed(2)}</td>
                    <td className="py-2">${row.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!!data.recommendations?.length && (
        <Card>
          <h3 className="text-lg font-semibold">Recommendations</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-500">
            {data.recommendations.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
