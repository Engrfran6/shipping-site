import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react"

export async function SystemStats() {
  const supabase = await createClient()

  // Get data for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [shipmentsResult, quotesResult, usersResult] = await Promise.all([
    supabase
      .from("shipments")
      .select("created_at, total_cost, service_type")
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("quotes").select("created_at, estimated_cost").gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("profiles").select("created_at, user_type").gte("created_at", sevenDaysAgo.toISOString()),
  ])

  const recentShipments = shipmentsResult.data || []
  const recentQuotes = quotesResult.data || []
  const newUsers = usersResult.data?.filter((u) => u.user_type === "client") || []

  // Calculate service type distribution
  const serviceTypes = recentShipments.reduce(
    (acc, shipment) => {
      acc[shipment.service_type] = (acc[shipment.service_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalShipments = recentShipments.length
  const weeklyRevenue = recentShipments.reduce((sum, s) => sum + (s.total_cost || 0), 0)
  const avgOrderValue = totalShipments > 0 ? weeklyRevenue / totalShipments : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">New Shipments</span>
            </div>
            <span className="text-2xl font-bold">{totalShipments}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Weekly Revenue</span>
            </div>
            <span className="text-2xl font-bold">${weeklyRevenue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Avg Order Value</span>
            </div>
            <span className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">New Users</span>
            </div>
            <span className="text-2xl font-bold">{newUsers.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(serviceTypes).map(([service, count]) => {
            const percentage = totalShipments > 0 ? (count / totalShipments) * 100 : 0
            return (
              <div key={service} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{service.replace("_", " ")}</span>
                  <span className="text-sm text-gray-500">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
          {Object.keys(serviceTypes).length === 0 && (
            <p className="text-center text-gray-500 py-4">No shipments this week</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quote Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{recentQuotes.length}</div>
            <p className="text-sm text-gray-500">Quotes this week</p>
            <div className="mt-4">
              <div className="text-lg font-semibold">
                ${recentQuotes.reduce((sum, q) => sum + (q.estimated_cost || 0), 0).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Potential revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
