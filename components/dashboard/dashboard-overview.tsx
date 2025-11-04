import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, TrendingUp } from "lucide-react"

interface DashboardOverviewProps {
  userId: string
}

export async function DashboardOverview({ userId }: DashboardOverviewProps) {
  const supabase = await createClient()

  // Get shipment statistics
  const { data: shipments } = await supabase.from("shipments").select("status, total_cost").eq("user_id", userId)

  const stats = {
    total: shipments?.length || 0,
    inTransit: shipments?.filter((s) => s.status === "in_transit").length || 0,
    delivered: shipments?.filter((s) => s.status === "delivered").length || 0,
    totalSpent: shipments?.reduce((sum, s) => sum + (s.total_cost || 0), 0) || 0,
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time shipments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inTransit}</div>
          <p className="text-xs text-muted-foreground">Currently shipping</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.delivered}</div>
          <p className="text-xs text-muted-foreground">Successfully delivered</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time spending</p>
        </CardContent>
      </Card>
    </div>
  )
}
