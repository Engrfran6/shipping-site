"use client";

import MainTracker from "@/components/guest/main-tracker";
import {PackageTracker} from "@/components/guest/package-tracker";
import {PaymentOption} from "@/components/guest/tracking-history";
import {createClient} from "@/lib/supabase/client";
import {Shipment, TrackingEvent} from "@/lib/types/database";
import {useState} from "react";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // 1️⃣ Get shipment details
      const {data: shipmentData, error: shipmentError} = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber.trim().toUpperCase())
        .maybeSingle();

      if (shipmentError || !shipmentData) {
        throw new Error("Tracking number not found");
      }

      // 2️⃣ Get tracking events for this shipment
      const {data: eventsData, error: eventsError} = await supabase
        .from("tracking_events")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("created_at", {ascending: true});

      if (eventsError) throw eventsError;

      // 3️⃣ Get payment details from view (for all events)
      const eventIds = eventsData.map((e) => e.id);
      let payments: PaymentOption[] = [];

      if (eventIds.length > 0) {
        const {data: paymentsData, error: paymentsError} = await supabase
          .from("v_tracking_event_payment_details")
          .select("*")
          .in("tracking_event_id", eventIds);

        if (paymentsError) throw paymentsError;
        payments = paymentsData || [];
      }

      setShipment(shipmentData);
      setTrackingEvents(eventsData || []);
      setPaymentOptions(payments || []);
    } catch (error: any) {
      console.error("Tracking error:", error.message);
      setError("Failed to track package, invalid tracking number");
      setShipment(null);
      setTrackingEvents([]);
      setPaymentOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 flex items-center justify-center">
      <div className="container max-w-7xl mx-auto">
        {!shipment ? (
          <MainTracker
            trackingNumber={trackingNumber}
            setTrackingNumber={setTrackingNumber}
            isLoading={isLoading}
            error={error}
            handleTrack={handleTrack}
          />
        ) : (
          <div className="animate-fadeInUp">
            <PackageTracker
              trackingNumber={trackingNumber}
              setTrackingNumber={setTrackingNumber}
              shipment={shipment}
              trackingEvents={trackingEvents}
              paymentOptions={paymentOptions}
              isLoading={isLoading}
              error={error}
              handleTrack={handleTrack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
