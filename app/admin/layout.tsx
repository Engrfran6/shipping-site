import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main>{children}</main>
      </div>
    </AuthGuard>
  )
}
