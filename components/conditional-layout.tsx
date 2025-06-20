"use client";

import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // When not authenticated, render children without sidebar
    return <main className="min-h-screen">{children}</main>;
  }

  // When authenticated, render with sidebar
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
