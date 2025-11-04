import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

export async function AdminOverview() {
  const supabase = await createClient();

  // Get comprehensive statistics
  const [shipmentsResult, usersResult, quotesResult] = await Promise.all([
    supabase.from("shipments").select("status, total_cost, created_at"),
    supabase.from("profiles").select("user_type, created_at"),
    supabase.from("quotes").select("status, estimated_cost, created_at"),
  ]);

  const shipments = shipmentsResult.data || [];
  const users = usersResult.data || [];
  const quotes = quotesResult.data || [];

  // Calculate statistics
  const stats = {
    totalShipments: shipments.length,
    activeShipments: shipments.filter((s) =>
      [
        "pending",
        "confirmed",
        "picked_up",
        "in_transit",
        "out_for_delivery",
      ].includes(s.status)
    ).length,
    deliveredShipments: shipments.filter((s) => s.status === "delivered")
      .length,
    exceptionShipments: shipments.filter((s) => s.status === "exception")
      .length,
    totalUsers: users.filter((u) => u.user_type === "client").length,
    totalRevenue: shipments.reduce((sum, s) => sum + (s.total_cost || 0), 0),
    pendingQuotes: quotes.filter((q) => q.status === "pending").length,
  };

  // Calculate growth (last 30 days vs previous 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const recentShipments = shipments.filter(
    (s) => new Date(s.created_at) > thirtyDaysAgo
  ).length;
  const previousShipments = shipments.filter(
    (s) =>
      new Date(s.created_at) > sixtyDaysAgo &&
      new Date(s.created_at) <= thirtyDaysAgo
  ).length;

  const shipmentGrowth =
    previousShipments > 0
      ? ((recentShipments - previousShipments) / previousShipments) * 100
      : 0;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalShipments}</div>
          <p className="text-xs text-muted-foreground">
            {shipmentGrowth > 0 ? "+" : ""}
            {shipmentGrowth.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Shipments
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeShipments}</div>
          <p className="text-xs text-muted-foreground">Currently in transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            User{stats.totalUsers === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">All time revenue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.deliveredShipments}</div>
          <p className="text-xs text-muted-foreground">
            Successfully delivered
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.exceptionShipments}</div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
          <Package className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
          <p className="text-xs text-muted-foreground">Awaiting response</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalShipments > 0
              ? (
                  (stats.deliveredShipments / stats.totalShipments) *
                  100
                ).toFixed(1)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">Delivery success rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
