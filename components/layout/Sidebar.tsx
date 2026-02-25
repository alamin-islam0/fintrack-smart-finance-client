'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const userLinks = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/transactions', label: 'Transactions' },
  { href: '/dashboard/savings', label: 'Savings Goals' },
  { href: '/dashboard/budgets', label: 'Budgets' },
  { href: '/dashboard/bills', label: 'Bill Reminders' },
  { href: '/dashboard/insights', label: 'Insights' },
  { href: '/dashboard/profile', label: 'Profile' }
];

const adminLinks = [
  { href: '/admin', label: 'Admin Home' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/reports', label: 'Reports' }
];

export function Sidebar({ role, open, onClose }: { role: 'user' | 'admin'; open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white/95 p-5 transition-transform dark:border-slate-800 dark:bg-slate-950/90 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-brand-primary" onClick={onClose}>
          FinTrack
        </Link>
        <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              'block rounded-xl px-3 py-2 text-sm font-medium transition',
              pathname === link.href
                ? 'bg-brand-primary text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
