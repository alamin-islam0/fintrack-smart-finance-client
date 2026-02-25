'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppShell({ role, children }: { role: 'admin' | 'user'; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-3 dark:bg-brand-bg sm:px-4 sm:py-4 lg:pl-80">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      {open && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu backdrop" />}
      <div className="mx-auto max-w-7xl">
        <Navbar onMenu={() => setOpen((p) => !p)} />
        <main>{children}</main>
      </div>
    </div>
  );
}
