"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Shipment, TrackingEvent } from "@/lib/types/database";
import { AlertCircle, CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface ShipmentDetailsProps {
  shipmentId?: string; // optional: will fetch if provided
  shipment?: Shipment; // optional: use pre-fetched data
  events?: TrackingEvent[]; // optional: use pre-fetched data
}

export function ShipmentDetails({
  shipmentId,
  shipment: shipmentProp,
  events: eventsProp,
}: ShipmentDetailsProps) {
  const [shipment, setShipment] = useState<Shipment | null>(
    shipmentProp || null
  );
  const [events, setEvents] = useState<TrackingEvent[]>(eventsProp || []);
  const [loading, setLoading] = useState(!shipmentProp);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch if shipmentId is provided
  useEffect(() => {
    if (!shipmentId || shipmentProp) return;

    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();

      try {
        const { data: shipmentData, error: shipmentError } = await supabase
          .from("shipments")
          .select("*")
          .eq("id", shipmentId)
          .maybeSingle();

        if (shipmentError) throw shipmentError;
        if (!shipmentData) throw new Error("Shipment not found.");

        const { data: eventsData, error: eventsError } = await supabase
          .from("tracking_events")
          .select("*")
          .eq("shipment_id", shipmentData.id)
          .order("created_at", { ascending: false });

        if (eventsError) throw eventsError;

        setShipment(shipmentData);
        setEvents(eventsData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load shipment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shipmentId, shipmentProp]);

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "exception":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Loading shipment...</div>
    );

  if (error)
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  if (!shipment)
    return (
      <div className="text-center py-10 text-gray-500">Shipment not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Shipment Summary */}
      <Card>
        <CardHeader className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Shipment Details</CardTitle>
            <CardDescription>
              Tracking Number: {shipment.tracking_number}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(shipment.status)}>
            {getStatusIcon(shipment.status)}
            <span className="ml-1">{formatStatus(shipment.status)}</span>
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">Sender</h4>
              <p className="text-sm text-gray-600">
                {shipment.sender_name}
                <br />
                {shipment.sender_address}
                <br />
                {shipment.sender_city}, {shipment.sender_state}{" "}
                {shipment.sender_postal_code}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recipient</h4>
              <p className="text-sm text-gray-600">
                {shipment.recipient_name}
                <br />
                {shipment.recipient_address}
                <br />
                {shipment.recipient_city}, {shipment.recipient_state}{" "}
                {shipment.recipient_postal_code}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div>
              <div className="text-sm text-gray-500">Service Type</div>
              <div className="font-semibold">
                {formatStatus(shipment.service_type)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Weight</div>
              <div className="font-semibold">{shipment.weight_kg} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Cost</div>
              <div className="font-semibold">${shipment.total_cost}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
          <CardDescription>Latest package events</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        i === 0 ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {getStatusIcon(event.event_type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {formatStatus(event.event_type)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {event.event_description}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <p>No tracking events yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
