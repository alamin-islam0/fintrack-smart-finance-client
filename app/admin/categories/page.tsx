'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { Modal } from '@/components/shared/Modal';
import { EmptyState } from '@/components/shared/EmptyState';
import { adminApi, Category } from '@/services/api/admin';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.categories();
      setCategories(data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setName('');
    setType('expense');
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditId(category._id);
    setName(category.name);
    setType(category.type);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setName('');
    setType('expense');
  };

  const save = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      if (editId) {
        const { data } = await adminApi.updateCategory(editId, { name: name.trim(), type });
        setCategories((prev) => prev.map((item) => (item._id === editId ? data : item)));
        toast.success('Category updated');
      } else {
        const { data } = await adminApi.createCategory({ name: name.trim(), type });
        setCategories((prev) => [...prev, data]);
        toast.success('Category created');
      }
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return;

    try {
      await adminApi.deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item._id !== id));
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading categories...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>Add Category</Button>
      </div>

      {!categories.length ? (
        <EmptyState title="No categories" description="Create categories for income and expenses." />
      ) : (
        <DataTable
          columns={['Category', 'Type', 'Action']}
          rows={categories}
          renderRow={(item) => (
            <>
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3 capitalize">{item.type}</td>
              <td className="space-x-2 px-4 py-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(item._id)}>
                  Delete
                </Button>
              </td>
            </>
          )}
        />
      )}

      <Modal open={open} onClose={closeModal} title={editId ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-3">
          <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
          <select
            className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? 'Saving...' : editId ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
