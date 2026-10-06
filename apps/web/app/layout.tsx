import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/ui/AppShell';

export const metadata: Metadata = {
  title: 'ReCircuit — AI Circular Electronics Reuse & Project Matching',
  description: 'Turn spare electronics into useful builds. Scan what you have, find what it can become, and source only what’s missing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
