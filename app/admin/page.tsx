'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StatCard } from '@/components/shared/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi, AdminReport } from '@/services/api/admin';

export default function AdminHomePage() {
  const [report, setReport] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await adminApi.reports();
        setReport(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Users" value={report?.totalUsers || 0} />
      <StatCard title="Transactions" value={report?.totalTransactions || 0} />
      <StatCard title="Tips Published" value={report?.totalTips || 0} />
      <StatCard title="Net Platform Balance" value={report?.balance || 0} />
    </div>
  );
}
