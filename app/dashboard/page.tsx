'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { transactionApi, MonthlyTrend, TransactionSummary, Transaction, CategoryBreakdown } from '@/services/api/transactions';

const IncomeExpenseChart = dynamic(
  () => import('@/components/charts/IncomeExpenseChart').then((m) => m.IncomeExpenseChart),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> }
);
const CategoryPieChart = dynamic(
  () => import('@/components/charts/CategoryPieChart').then((m) => m.CategoryPieChart),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> }
);
const MonthlyTrendChart = dynamic(
  () => import('@/components/charts/MonthlyTrendChart').then((m) => m.MonthlyTrendChart),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> }
);

export default function DashboardPage() {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await transactionApi.dashboard({ recentLimit: 6 });
        setSummary(data.summary || null);
        setTrends(data.trends || []);
        setTransactions(data.recentTransactions || []);
        setCategoryData(data.categoryBreakdown || []);
        setTransactionCount(data.transactionCount || 0);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = trends.map((item) => ({
    month: item.label,
    income: item.income,
    expense: item.expense,
    total: item.total
  }));

  if (!loading && !summary) {
    return <EmptyState title="Dashboard unavailable" description="Unable to load dashboard metrics right now." />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard title="Total Balance" value={summary.balance} />
            <StatCard title="Total Income" value={summary.totalIncome} tone="income" />
            <StatCard title="Total Expense" value={summary.totalExpense} tone="expense" />
            <StatCard title="Transactions" value={transactionCount} />
          </>
        )}
      </section>

      {loading ? (
        <>
          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <Skeleton className="h-80 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </section>
          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <Skeleton className="h-80 w-full" />
            </div>
            <div className="space-y-3 xl:col-span-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-64 w-full" />
            </div>
          </section>
        </>
      ) : chartData.length ? (
        <>
          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <IncomeExpenseChart data={chartData} />
            </div>
            {categoryData.length ? <CategoryPieChart data={categoryData} /> : <EmptyState title="No expense categories" description="Add expense transactions to view category distribution." />}
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <MonthlyTrendChart data={chartData} />
            </div>
            <div className="xl:col-span-1">
              <h3 className="mb-3 text-lg font-semibold">Recent Transactions</h3>
              {transactions.length ? (
                <DataTable
                  columns={['Type', 'Category', 'Amount', 'Date']}
                  rows={transactions}
                  renderRow={(row) => (
                    <>
                      <td className="px-4 py-3 capitalize">{row.type}</td>
                      <td className="px-4 py-3">{row.category}</td>
                      <td className="px-4 py-3">${row.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">{new Date(row.date).toLocaleDateString()}</td>
                    </>
                  )}
                />
              ) : (
                <EmptyState title="No transactions" description="Add your first transaction to populate dashboard activity." />
              )}
            </div>
          </section>
        </>
      ) : (
        <EmptyState title="No trend data" description="Add transactions across months to visualize trends and analytics." />
      )}
    </motion.div>
  );
}
