'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { budgetsApi, Budget } from '@/services/api/budgets';
import { categoriesApi, Category } from '@/services/api/categories';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/Modal';
import { EmptyState } from '@/components/shared/EmptyState';

export default function BudgetsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ category: '', limitAmount: 0 });

  const load = async () => {
    try {
      const [budgetRes, categoryRes] = await Promise.all([budgetsApi.all(month), categoriesApi.all()]);
      setBudgets(budgetRes.data || []);
      setCategories((categoryRes.data || []).filter((c) => c.type === 'expense'));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load budgets');
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  const save = async () => {
    if (!form.category || !form.limitAmount) {
      toast.error('Category and limit are required');
      return;
    }

    try {
      setSaving(true);
      await budgetsApi.create({ category: form.category, month, limitAmount: Number(form.limitAmount) });
      setOpen(false);
      setForm({ category: '', limitAmount: 0 });
      toast.success('Budget created');
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this budget?')) return;
    await budgetsApi.remove(id);
    setBudgets((prev) => prev.filter((b) => b._id !== id));
    toast.success('Budget deleted');
  };

  const totalLimit = useMemo(() => budgets.reduce((acc, b) => acc + b.limitAmount, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + (b.spent || 0), 0), [budgets]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-52" />
        <Button onClick={() => setOpen(true)}>Add Budget</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Total Budget Limit</p>
          <p className="mt-2 text-2xl font-bold">${totalLimit.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total Spent</p>
          <p className="mt-2 text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </Card>
      </div>

      {!budgets.length ? (
        <EmptyState title="No budgets" description="Create monthly category budgets to track overspending risk." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => (
            <Card key={budget._id}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{budget.category}</h3>
                <Button size="sm" variant="danger" onClick={() => remove(budget._id)}>
                  Delete
                </Button>
              </div>
              <p className="mt-2 text-sm text-slate-500">Limit: ${budget.limitAmount.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Spent: ${(budget.spent || 0).toFixed(2)}</p>
              <p className="text-sm text-slate-500">Remaining: ${(budget.remaining || 0).toFixed(2)}</p>
              <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`${(budget.status || 'safe') === 'over' ? 'bg-brand-danger' : (budget.status || 'safe') === 'warning' ? 'bg-amber-500' : 'bg-brand-secondary'} h-full rounded-full`}
                  style={{ width: `${Math.min(100, budget.usagePercent || 0)}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create Budget">
        <div className="space-y-3">
          <select
            className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Limit amount"
            value={form.limitAmount || ''}
            onChange={(e) => setForm((p) => ({ ...p, limitAmount: Number(e.target.value) }))}
          />
          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Create Budget'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
