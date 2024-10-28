// src/app/(dashboard)/layout.tsx
'use client';

import { ResolvedEventsProvider } from '@/contexts/ResolvedEventsContext';
import { DashboardNav } from '../../components/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ResolvedEventsProvider>
      <div className="min-h-screen bg-white">
        <DashboardNav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ResolvedEventsProvider>
  );
}
