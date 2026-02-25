'use client';

import { Menu, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:mb-6 sm:px-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs text-slate-500">Welcome back</p>
          <h1 className="max-w-[9.5rem] truncate text-sm font-semibold sm:max-w-none sm:text-base">{user?.name || 'FinTrack User'}</h1>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </Button>
        <Button variant="outline" onClick={logout} className="h-9 gap-2 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
