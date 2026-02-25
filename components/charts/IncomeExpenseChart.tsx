'use client';

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Card } from '@/components/ui/card';

export function IncomeExpenseChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  return (
    <Card className="h-[320px]">
      <h3 className="mb-4 text-lg font-semibold">Income vs Expense</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#22C55E" radius={8} />
          <Bar dataKey="expense" fill="#EF4444" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
