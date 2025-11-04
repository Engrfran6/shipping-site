import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your shipping performance and trends</p>
      </div>

      <AnalyticsDashboard userId={user.id} />
    </div>
  )
}
