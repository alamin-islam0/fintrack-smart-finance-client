'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

const COLORS = ['#6366F1', '#22C55E', '#F97316', '#EF4444', '#0EA5E9'];

export function CategoryPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card className="h-[320px]">
      <h3 className="mb-4 text-lg font-semibold">Expense by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={105}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
