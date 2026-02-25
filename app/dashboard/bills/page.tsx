'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { billsApi, Bill, BillPayload } from '@/services/api/bills';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/shared/Modal';
import { EmptyState } from '@/components/shared/EmptyState';

const defaultForm: BillPayload = {
  title: '',
  amount: 0,
  dueDate: new Date().toISOString().split('T')[0],
  recurring: false,
  status: 'pending'
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [status, setStatus] = useState<'pending' | 'paid' | 'all'>('all');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BillPayload>(defaultForm);

  const fetchBills = async () => {
    try {
      const { data } = await billsApi.all(status === 'all' ? undefined : status);
      setBills(data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load bills');
    }
  };

  useEffect(() => {
    fetchBills();
  }, [status]);

  const dueSoonCount = useMemo(() => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    return bills.filter((bill) => {
      const due = new Date(bill.dueDate);
      return bill.status === 'pending' && due >= now && due <= sevenDaysLater;
    }).length;
  }, [bills]);

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

  const openEdit = (bill: Bill) => {
    setEditId(bill._id);
    setForm({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill.dueDate.split('T')[0],
      recurring: bill.recurring,
      status: bill.status
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.amount || !form.dueDate) {
      toast.error('Title, amount and due date are required');
      return;
    }

    try {
      setSaving(true);
      if (editId) {
        const { data } = await billsApi.update(editId, form);
        setBills((prev) => prev.map((b) => (b._id === editId ? data : b)));
        toast.success('Bill updated');
      } else {
        const { data } = await billsApi.create(form);
        setBills((prev) => [data, ...prev]);
        toast.success('Bill created');
      }
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save bill');
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (bill: Bill) => {
    try {
      const { data } = await billsApi.update(bill._id, { status: bill.status === 'paid' ? 'pending' : 'paid' });
      setBills((prev) => prev.map((b) => (b._id === bill._id ? data : b)));
      toast.success(`Bill marked as ${data.status}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update bill status');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this bill?')) return;
    await billsApi.remove(id);
    setBills((prev) => prev.filter((b) => b._id !== id));
    toast.success('Bill deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <select
            className="rounded-2xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'pending' | 'paid' | 'all')}
          >
            <option value="all">All Bills</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <p className="text-sm text-slate-500">Due in 7 days: {dueSoonCount}</p>
        </div>
        <Button onClick={openCreate}>Add Bill</Button>
      </div>

      {!bills.length ? (
        <EmptyState title="No bills" description="Add recurring bills to track payments and due dates." />
      ) : (
        <DataTable
          columns={['Title', 'Amount', 'Due Date', 'Recurring', 'Status', 'Actions']}
          rows={bills}
          renderRow={(row) => (
            <>
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3">${row.amount.toFixed(2)}</td>
              <td className="px-4 py-3">{new Date(row.dueDate).toLocaleDateString()}</td>
              <td className="px-4 py-3">{row.recurring ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3 capitalize">{row.status}</td>
              <td className="space-x-2 px-4 py-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => markPaid(row)}>
                  Mark {row.status === 'paid' ? 'Pending' : 'Paid'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(row._id)}>
                  Delete
                </Button>
              </td>
            </>
          )}
        />
      )}

      <Modal open={open} onClose={closeModal} title={editId ? 'Edit Bill' : 'Add Bill'}>
        <div className="space-y-3">
          <Input placeholder="Bill title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount || ''}
            onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))}
          />
          <Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.recurring}
              onChange={(e) => setForm((p) => ({ ...p, recurring: e.target.checked }))}
            />
            Recurring bill
          </label>
          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? 'Saving...' : editId ? 'Update Bill' : 'Create Bill'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
