import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  columns: string[];
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({ columns, rows, renderRow, className }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700', className)}>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-semibold">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
