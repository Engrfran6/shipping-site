import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemRevenueChart } from "./system-revenue-chart"
import { UserGrowthChart } from "./user-growth-chart"
import { ServicePerformanceChart } from "./service-performance-chart"
import { GeographicDistribution } from "./geographic-distribution"
import { TrendingUp, Users, Package, DollarSign } from "lucide-react"

export async function AdminAnalyticsDashboard() {
  const supabase = await createClient()

  // Get comprehensive system data
  const [shipmentsResult, usersResult, quotesResult] = await Promise.all([
    supabase.from("shipments").select("*").order("created_at", { ascending: true }),
    supabase.from("profiles").select("*").order("created_at", { ascending: true }),
    supabase.from("quotes").select("*").order("created_at", { ascending: true }),
  ])

  const shipments = shipmentsResult.data || []
  const users = usersResult.data || []
  const quotes = quotesResult.data || []

  // Calculate key metrics
  const totalRevenue = shipments.reduce((sum, s) => sum + (s.total_cost || 0), 0)
  const totalUsers = users.filter((u) => u.user_type === "client").length
  const totalShipments = shipments.length
  const avgOrderValue = totalShipments > 0 ? totalRevenue / totalShipments : 0

  // Calculate growth rates (last 30 days vs previous 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

  const recentRevenue = shipments
    .filter((s) => new Date(s.created_at) > thirtyDaysAgo)
    .reduce((sum, s) => sum + (s.total_cost || 0), 0)

  const previousRevenue = shipments
    .filter((s) => new Date(s.created_at) > sixtyDaysAgo && new Date(s.created_at) <= thirtyDaysAgo)
    .reduce((sum, s) => sum + (s.total_cost || 0), 0)

  const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0

  const recentUsers = users.filter((u) => new Date(u.created_at) > thirtyDaysAgo && u.user_type === "client").length
  const previousUsers = users.filter(
    (u) => new Date(u.created_at) > sixtyDaysAgo && new Date(u.created_at) <= thirtyDaysAgo && u.user_type === "client",
  ).length

  const userGrowth = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {revenueGrowth > 0 ? "+" : ""}
              {revenueGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {userGrowth > 0 ? "+" : ""}
              {userGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">All time shipments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per shipment</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SystemRevenueChart shipments={shipments} />
        <UserGrowthChart users={users} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ServicePerformanceChart shipments={shipments} />
        <GeographicDistribution shipments={shipments} />
      </div>
    </div>
  )
}
