'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi, AdminReport } from '@/services/api/admin';
import { EmptyState } from '@/components/shared/EmptyState';

export default function ReportsPage() {
  const [report, setReport] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipTitle, setTipTitle] = useState('');
  const [tipContent, setTipContent] = useState('');
  const [submittingTip, setSubmittingTip] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.reports();
      setReport(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const topCategories = useMemo(() => {
    if (!report) return [];
    return Object.entries(report.categoryStats || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [report]);

  const submitTip = async () => {
    if (!tipTitle.trim() || !tipContent.trim()) {
      toast.error('Tip title and content are required');
      return;
    }

    try {
      setSubmittingTip(true);
      await adminApi.createTip({ title: tipTitle.trim(), content: tipContent.trim() });
      setTipTitle('');
      setTipContent('');
      toast.success('Tip created');
      fetchReport();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create tip');
    } finally {
      setSubmittingTip(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading reports...</p>;

  if (!report) return <EmptyState title="No report data" description="Unable to retrieve report analytics right now." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h3 className="text-lg font-semibold">Financial Overview</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-500">
          <p>Total Income: ${report.totalIncome.toFixed(2)}</p>
          <p>Total Expense: ${report.totalExpense.toFixed(2)}</p>
          <p>Net Balance: ${report.balance.toFixed(2)}</p>
          <p>Total Transactions: {report.totalTransactions}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold">Savings Overview</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-500">
          <p>Target Savings: ${report.savingsSummary.target.toFixed(2)}</p>
          <p>Current Savings: ${report.savingsSummary.current.toFixed(2)}</p>
          <p>
            Savings Completion:{' '}
            {report.savingsSummary.target
              ? ((report.savingsSummary.current / report.savingsSummary.target) * 100).toFixed(1)
              : '0'}
            %
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold">Top Expense Categories</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-500">
          {topCategories.length ? (
            topCategories.map(([name, amount]) => (
              <p key={name} className="flex justify-between">
                <span>{name}</span>
                <span>${amount.toFixed(2)}</span>
              </p>
            ))
          ) : (
            <p>No category spend data available.</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold">Publish Financial Tip</h3>
        <div className="mt-3 space-y-3">
          <Input placeholder="Tip title" value={tipTitle} onChange={(e) => setTipTitle(e.target.value)} />
          <Input placeholder="Tip content" value={tipContent} onChange={(e) => setTipContent(e.target.value)} />
          <Button onClick={submitTip} disabled={submittingTip}>
            {submittingTip ? 'Publishing...' : 'Publish Tip'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
