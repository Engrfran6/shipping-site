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

interface RealTimeTrackerProps {
  trackingNumber: string;
}

export function RealTimeTracker({ trackingNumber }: RealTimeTrackerProps) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trackingNumber) {
      fetchTrackingData();
      // Set up real-time subscription
      const supabase = createClient();
      const subscription = supabase
        .channel("tracking_updates")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "tracking_events",
            filter: `shipment_id=eq.${shipment?.id}`,
          },
          (payload) => {
            setTrackingEvents((prev) => [
              payload.new as TrackingEvent,
              ...prev,
            ]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [trackingNumber, shipment?.id]);

  const fetchTrackingData = async () => {
    try {
      const supabase = createClient();

      // Get shipment details
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber.toUpperCase())
        .maybeSingle();

      if (shipmentError) throw shipmentError;

      // Get tracking events
      const { data: eventsData, error: eventsError } = await supabase
        .from("tracking_events")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;

      setShipment(shipmentData);
      setTrackingEvents(eventsData || []);
    } catch (error: any) {
      setError(error.message || "Failed to fetch tracking data");
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !shipment) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-600">{error || "Shipment not found"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shipment Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Package Status</CardTitle>
            <Badge className={getStatusColor(shipment.status)}>
              {getStatusIcon(shipment.status)}
              <span className="ml-1">{formatStatus(shipment.status)}</span>
            </Badge>
          </div>
          <CardDescription>
            Tracking: {shipment.tracking_number}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">From</h4>
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
              <h4 className="font-semibold text-gray-900 mb-2">To</h4>
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
        </CardContent>
      </Card>

      {/* Real-time Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Live Tracking Updates</CardTitle>
          <CardDescription>
            Real-time updates on your package journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trackingEvents.length > 0 ? (
            <div className="space-y-4">
              {trackingEvents.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-blue-100 animate-pulse"
                          : "bg-gray-100"
                      }`}
                    >
                      {getStatusIcon(event.event_type)}
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
                    <p className="text-sm text-gray-600">
                      {event.event_description}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                    {index === 0 && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Latest Update
                      </Badge>
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
