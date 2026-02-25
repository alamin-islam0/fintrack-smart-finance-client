'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { Modal } from '@/components/shared/Modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { transactionApi, Transaction, CreateTransactionPayload } from '@/services/api/transactions';
import { categoriesApi, Category } from '@/services/api/categories';

const DEFAULT_CATEGORY_FALLBACK: Record<'income' | 'expense', string[]> = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift'],
  expense: ['Food', 'Transport', 'Housing', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Education']
};

const defaultForm: CreateTransactionPayload = {
  amount: 0,
  type: 'expense',
  category: '',
  date: new Date().toISOString().split('T')[0],
  note: ''
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateTransactionPayload>(defaultForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, catRes] = await Promise.all([
        transactionApi.all({
          search: query || undefined,
          type: typeFilter === 'all' ? undefined : (typeFilter as 'income' | 'expense'),
          category: categoryFilter === 'all' ? undefined : categoryFilter,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sort: '-date'
        }),
        categoriesApi.all()
      ]);
      setTransactions(transRes.data || []);
      setCategories(catRes.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryOptions = useMemo(() => {
    const fromApi = categories.filter((c) => c.type === form.type).map((c) => c.name);
    return Array.from(new Set([...fromApi, ...DEFAULT_CATEGORY_FALLBACK[form.type]])).sort((a, b) => a.localeCompare(b));
  }, [categories, form.type]);

  const filterCategoryOptions = useMemo(() => {
    const fromApi = categories.map((c) => c.name);
    return Array.from(new Set([...fromApi, ...DEFAULT_CATEGORY_FALLBACK.income, ...DEFAULT_CATEGORY_FALLBACK.expense])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [categories]);

  const handleSearch = () => {
    fetchData();
  };

  const handleSave = async () => {
    if (!form.amount || !form.category || !form.date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        const { data } = await transactionApi.update(editingId, form);
        setTransactions((prev) => prev.map((t) => (t._id === editingId ? data : t)));
        toast.success('Transaction updated');
      } else {
        const { data } = await transactionApi.create(form);
        setTransactions((prev) => [data, ...prev]);
        toast.success('Transaction added');
      }
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;

    try {
      await transactionApi.remove(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success('Transaction deleted');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setForm({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.split('T')[0],
      note: transaction.note || ''
    });
    setEditingId(transaction._id);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-7">
        <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} className="md:col-span-2" />
        <select
          className="rounded-2xl border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="rounded-2xl border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-900"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {filterCategoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button onClick={handleSearch}>Apply</Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={openCreate}>Add Transaction</Button>
      </div>

      {!transactions.length ? (
        <EmptyState title="No transactions found" description="Adjust filters or add a new transaction to get started." />
      ) : (
        <DataTable
          columns={['Amount', 'Type', 'Category', 'Date', 'Note', 'Action']}
          rows={transactions}
          renderRow={(row) => (
            <>
              <td className="px-4 py-3">${row.amount.toFixed(2)}</td>
              <td className="px-4 py-3 capitalize">{row.type}</td>
              <td className="px-4 py-3">{row.category}</td>
              <td className="px-4 py-3">{new Date(row.date).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{row.note || '-'}</td>
              <td className="space-x-2 px-4 py-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(row._id)}>
                  Delete
                </Button>
              </td>
            </>
          )}
        />
      )}

      <Modal open={open} onClose={closeModal} title={editingId ? 'Edit Transaction' : 'Add Transaction'}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Amount *</label>
            <Input
              type="number"
              placeholder="0.00"
              value={form.amount || ''}
              onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Type *</label>
            <select
              className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as 'income' | 'expense', category: '' }))}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category *</label>
            <Input
              list="transaction-category-options"
              placeholder="Select or type category"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            />
            <datalist id="transaction-category-options">
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Date *</label>
            <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Note</label>
            <Input placeholder="Optional note..." value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : editingId ? 'Update Transaction' : 'Save Transaction'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
