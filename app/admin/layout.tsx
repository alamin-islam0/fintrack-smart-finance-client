import { AppShell } from '@/components/layout/AppShell';
import { Protected } from '@/components/layout/Protected';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <AppShell role="admin">{children}</AppShell>
    </Protected>
  );
}
