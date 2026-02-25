'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { goalsApi, SavingsGoal } from '@/services/api/goals';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/Modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { currency } from '@/lib/utils';

const defaultForm = {
  title: '',
  targetAmount: 0,
  currentAmount: 0,
  deadline: ''
};

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [contributionValue, setContributionValue] = useState<Record<string, string>>({});
  const [form, setForm] = useState(defaultForm);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data } = await goalsApi.all();
      setGoals(data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setForm(defaultForm);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (goal: SavingsGoal) => {
    setEditId(goal._id);
    setForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
    });
    setOpen(true);
  };

  const saveGoal = async () => {
    if (!form.title || !form.targetAmount) {
      toast.error('Title and target amount are required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount),
        deadline: form.deadline || undefined
      };

      if (editId) {
        const { data } = await goalsApi.update(editId, payload);
        setGoals((prev) => prev.map((g) => (g._id === editId ? data : g)));
        toast.success('Goal updated');
      } else {
        const { data } = await goalsApi.create(payload);
        setGoals((prev) => [data, ...prev]);
        toast.success('Goal created');
      }

      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return;

    try {
      await goalsApi.remove(id);
      setGoals((prev) => prev.filter((g) => g._id !== id));
      toast.success('Goal deleted');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete goal');
    }
  };

  const addContribution = async (goalId: string) => {
    const contribution = Number(contributionValue[goalId] || 0);
    const existingGoal = goals.find((g) => g._id === goalId);
    if (!contribution || contribution <= 0) {
      toast.error('Enter a valid contribution amount');
      return;
    }
    if (!existingGoal) {
      toast.error('Goal not found');
      return;
    }

    try {
      const { data } = await goalsApi.update(goalId, {
        title: existingGoal.title,
        targetAmount: existingGoal.targetAmount,
        currentAmount: existingGoal.currentAmount,
        contribution
      });
      setGoals((prev) => prev.map((g) => (g._id === goalId ? data : g)));
      setContributionValue((prev) => ({ ...prev, [goalId]: '' }));
      toast.success('Contribution added');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add contribution');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>Create Goal</Button>
      </div>

      {!goals.length ? (
        <EmptyState title="No goals yet" description="Create your first savings goal to start tracking progress." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <Card key={goal._id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">Target: {currency(goal.targetAmount)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(goal)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteGoal(goal._id)}>
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-brand-secondary" style={{ width: `${progress}%` }} />
                </div>

                <p className="mt-3 text-sm">
                  Saved {currency(goal.currentAmount)} • Remaining {currency(goal.targetAmount - goal.currentAmount)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
                </p>

                <div className="mt-4 flex gap-2">
                  <Input
                    type="number"
                    placeholder="Add contribution"
                    value={contributionValue[goal._id] || ''}
                    onChange={(e) => setContributionValue((prev) => ({ ...prev, [goal._id]: e.target.value }))}
                  />
                  <Button size="sm" onClick={() => addContribution(goal._id)}>
                    Add
                  </Button>
                </div>

                {!!goal.contributions?.length && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Contribution History</p>
                    <div className="space-y-1 text-sm">
                      {goal.contributions.slice(-5).map((item, i) => (
                        <p key={i} className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>{new Date(item.date || new Date()).toLocaleDateString()}</span>
                          <span>{currency(item.amount)}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={closeModal} title={editId ? 'Edit Goal' : 'Create Goal'}>
        <div className="space-y-3">
          <Input placeholder="Goal title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <Input
            type="number"
            placeholder="Target amount"
            value={form.targetAmount || ''}
            onChange={(e) => setForm((p) => ({ ...p, targetAmount: Number(e.target.value) }))}
          />
          <Input
            type="number"
            placeholder="Current amount"
            value={form.currentAmount || ''}
            onChange={(e) => setForm((p) => ({ ...p, currentAmount: Number(e.target.value) }))}
          />
          <Input type="date" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} />
          <Button onClick={saveGoal} disabled={saving} className="w-full">
            {saving ? 'Saving...' : editId ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
