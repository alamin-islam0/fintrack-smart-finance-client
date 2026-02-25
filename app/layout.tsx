import type { Metadata } from 'next';
import '@/app/globals.css';
import { Providers } from '@/components/shared/Providers';

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Modern personal finance analytics platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
