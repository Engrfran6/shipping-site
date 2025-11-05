import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {createClient} from "@/lib/supabase/server";
import {AlertTriangle, ArrowRight, Package} from "lucide-react";
import Link from "next/link";

export async function RecentActivity() {
  const supabase = await createClient();

  // Get recent shipments with user info
  const {data: recentShipments} = await supabase
    .from("shipments")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email
      )
    `
    )
    .order("created_at", {ascending: false})
    .limit(10);

  // Get recent tracking events
  const {data: recentEvents} = await supabase
    .from("tracking_events")
    .select(
      `
       *,
      shipments:shipment_id (
        tracking_number,
        recipient_name
      )
    `
    )
    .order("created_at", {ascending: false})
    .limit(5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800";
      case "exception":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>Latest shipment activity across all users</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/shipments">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentShipments && recentShipments.length > 0 ? (
            <div className="space-y-4">
              {recentShipments.slice(0, 3).map((shipment: any) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{shipment.tracking_number}</p>
                      <p className="text-sm text-gray-600">
                        {shipment.profiles?.full_name || "Unknown User"} → {shipment.recipient_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(shipment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(shipment.status)}>
                      {formatStatus(shipment.status)}
                    </Badge>
                    <p className="text-sm font-medium mt-1">${shipment.total_cost.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2" />
              <p>No recent shipments</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tracking Events</CardTitle>
          <CardDescription>Latest tracking updates across all shipments</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event: any) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {event.event_type === "exception" ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Package className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {formatStatus(event.event_type)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{event.event_description}</p>
                    <p className="text-xs text-gray-500">
                      {event.shipments?.tracking_number} - {event.shipments?.recipient_name}
                    </p>
                    {event.location && <p className="text-xs text-gray-500">📍 {event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2" />
              <p>No recent tracking events</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
