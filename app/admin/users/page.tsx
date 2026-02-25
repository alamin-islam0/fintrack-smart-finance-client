'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { adminApi, User } from '@/services/api/admin';
import { useAuth } from '@/context/AuthContext';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.users();
      setUsers(data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: 'admin' | 'user') => {
    try {
      const { data } = await adminApi.updateUserRole(id, role);
      setUsers((prev) => prev.map((item) => (item._id === id ? data : item)));
      toast.success('Role updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update role');
    }
  };

  const removeUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;

    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((item) => item._id !== id));
      toast.success('User deleted');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading users...</p>;

  if (!users.length) {
    return <EmptyState title="No users" description="No user records are available right now." />;
  }

  return (
    <>
      <div className="space-y-3 sm:hidden">
        {users.map((row) => (
          <div key={row._id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold">{row.name}</p>
            <p className="mt-1 text-xs text-slate-500">{row.email}</p>
            <p className="mt-1 text-xs capitalize text-slate-500">
              {row.role} • {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateRole(row._id, row.role === 'admin' ? 'user' : 'admin')}
                disabled={row._id === user?._id}
              >
                Make {row.role === 'admin' ? 'User' : 'Admin'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => removeUser(row._id)} disabled={row._id === user?._id}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <DataTable
        className="hidden sm:block"
        columns={['Name', 'Email', 'Role', 'Created', 'Actions']}
        rows={users}
        renderRow={(row) => (
          <>
            <td className="px-4 py-3">{row.name}</td>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3 capitalize">{row.role}</td>
            <td className="px-4 py-3">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}</td>
            <td className="space-x-2 px-4 py-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateRole(row._id, row.role === 'admin' ? 'user' : 'admin')}
                disabled={row._id === user?._id}
              >
                Make {row.role === 'admin' ? 'User' : 'Admin'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => removeUser(row._id)} disabled={row._id === user?._id}>
                Delete
              </Button>
            </td>
          </>
        )}
      />
    </>
  );
}
