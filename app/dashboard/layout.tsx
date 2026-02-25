import { AppShell } from '@/components/layout/AppShell';
import { Protected } from '@/components/layout/Protected';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <AppShell role="user">{children}</AppShell>
    </Protected>
  );
}
