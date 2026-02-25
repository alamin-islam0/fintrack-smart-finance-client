'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export function Protected({ children }: { children: React.ReactNode }) {
  const { loading } = useProtectedRoute();
  if (loading) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  return <>{children}</>;
}
