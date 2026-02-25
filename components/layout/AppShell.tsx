'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppShell({ role, children }: { role: 'admin' | 'user'; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 p-4 dark:bg-brand-bg lg:pl-80">
      <Sidebar role={role} open={open} />
      <div className="mx-auto max-w-7xl">
        <Navbar onMenu={() => setOpen((p) => !p)} />
        <main>{children}</main>
      </div>
    </div>
  );
}
