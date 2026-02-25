'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user && pathname !== '/' && !pathname.startsWith('/auth')) {
      router.push('/auth/login');
    }
    if (user?.role !== 'admin' && pathname.startsWith('/admin')) {
      router.push('/dashboard');
    }
  }, [loading, user, pathname, router]);

  return { user, loading };
}
