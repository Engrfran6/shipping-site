import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

interface RecentShipmentsProps {
  userId: string;
}

export async function RecentShipments({ userId }: RecentShipmentsProps) {
  const supabase = await createClient();

  const { data: shipments } = await supabase
    .from("shipments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Your latest shipping activity</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/shipments">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {shipments && shipments.length > 0 ? (
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{shipment.tracking_number}</p>
                    <p className="text-sm text-gray-600">
                      To: {shipment.recipient_city}, {shipment.recipient_state}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(shipment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(shipment.status)}>
                    {formatStatus(shipment.status)}
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    ${shipment.total_cost.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <p>No shipments yet</p>
            <Button
              asChild
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href="/dashboard/create">Create Your First Shipment</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
