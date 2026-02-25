import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('glass rounded-2xl border border-slate-200/20 p-5 shadow-soft dark:border-slate-700/40', className)}>
      {children}
    </div>
  );
}
