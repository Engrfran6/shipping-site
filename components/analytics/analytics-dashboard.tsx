import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";
import {Clock, DollarSign, Package, TrendingUp} from "lucide-react";
import {CostAnalysis} from "./cost-analysis";
import {DeliveryPerformance} from "./delivery-performance";
import {ServiceTypeChart} from "./service-type-chart";
import {ShippingChart} from "./shipping-chart";

interface AnalyticsDashboardProps {
  userId: string;
}

export async function AnalyticsDashboard({userId}: AnalyticsDashboardProps) {
  const supabase = await createClient();

  // Get shipment data for the last 6 months
  const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);

  const {data: shipments} = await supabase
    .from("shipments")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", {ascending: true});

  if (!shipments || shipments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 text-center max-w-md">
            You need to have some shipments to view analytics. Create your first shipment to start
            tracking your shipping performance.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate key metrics
  const totalShipments = shipments.length;
  const totalSpent = shipments.reduce((sum, s) => sum + (s.total_cost || 0), 0);
  const avgCost = totalShipments > 0 ? totalSpent / totalShipments : 0;
  const deliveredCount = shipments.filter((s) => s.status === "delivered").length;
  const deliveryRate = totalShipments > 0 ? (deliveredCount / totalShipments) * 100 : 0;

  // Calculate average delivery time for delivered shipments
  const deliveredShipments = shipments.filter(
    (s) => s.status === "delivered" && s.estimated_delivery_date
  );
  const avgDeliveryTime =
    deliveredShipments.length > 0
      ? deliveredShipments.reduce((sum, s) => {
          const created = new Date(s.created_at);
          const delivered = new Date(s.estimated_delivery_date!);
          return sum + (delivered.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / deliveredShipments.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average: ${avgCost.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{deliveredCount} delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeliveryTime.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">For delivered packages</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="max-w-2xl">
        <div className="grid lg:grid-cols-2 gap-6">
          <ShippingChart shipments={shipments} />
          <CostAnalysis shipments={shipments} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ServiceTypeChart shipments={shipments} />
          <DeliveryPerformance shipments={shipments} />
        </div>
      </div>
    </div>
  );
}
