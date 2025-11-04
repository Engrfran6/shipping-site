import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
