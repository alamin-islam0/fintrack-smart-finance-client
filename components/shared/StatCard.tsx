import { Card } from '@/components/ui/card';
import { currency } from '@/lib/utils';

export function StatCard({ title, value, tone = 'default' }: { title: string; value: number; tone?: 'default' | 'income' | 'expense' }) {
  const toneClass = tone === 'income' ? 'text-brand-secondary' : tone === 'expense' ? 'text-brand-danger' : 'text-brand-primary';

  return (
    <Card>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{currency(value)}</p>
    </Card>
  );
}
