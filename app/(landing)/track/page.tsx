"use client";

import MainTracker from "@/components/guest/main-tracker";
import { PackageTracker } from "@/components/guest/package-tracker";
import { PaymentOption } from "@/components/guest/tracking-history";
import { createClient } from "@/lib/supabase/client";
import { Shipment, TrackingEvent } from "@/lib/types/database";
import { useState } from "react";

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
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber.trim().toUpperCase())
        .maybeSingle();

      if (shipmentError || !shipmentData) {
        throw new Error("Tracking number not found");
      }

      // 2️⃣ Get tracking events for this shipment
      const { data: eventsData, error: eventsError } = await supabase
        .from("tracking_events")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("created_at", { ascending: true });

      if (eventsError) throw eventsError;

      // 3️⃣ Get payment details from view (for all events)
      const eventIds = eventsData.map((e) => e.id);
      let payments: PaymentOption[] = [];

      if (eventIds.length > 0) {
        const { data: paymentsData, error: paymentsError } = await supabase
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

// "use client";

// import { PackageTracker } from "@/components/guest/package-tracker";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { createClient } from "@/lib/supabase/client";
// import { Shipment, TrackingEvent } from "@/lib/types/database";
// import { Search } from "lucide-react";
// import { useState } from "react";

// export default function TrackPage() {
//   const [trackingNumber, setTrackingNumber] = useState("");
//   const [shipment, setShipment] = useState<Shipment | null>(null);
//   const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleTrack = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!trackingNumber.trim()) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const supabase = createClient();

//       // Get shipment details
//       const { data: shipmentData, error: shipmentError } = await supabase
//         .from("shipments")
//         .select("*")
//         .eq("tracking_number", trackingNumber.trim().toUpperCase())
//         .maybeSingle();

//       if (shipmentError) {
//         if (shipmentError.code === "PGRST116") {
//           throw new Error("Tracking number not found");
//         }
//         throw shipmentError;
//       }

//       // Get tracking events
//       const { data: eventsData, error: eventsError } = await supabase
//         .from("tracking_events")
//         .select("*")
//         .eq("shipment_id", shipmentData.id)
//         .order("created_at", { ascending: true });

//       if (eventsError) throw eventsError;

//       setShipment(shipmentData);
//       setTrackingEvents(eventsData || []);
//     } catch (error: any) {
//       setError("Failed to track package, invalid tracking number");
//       setShipment(null);
//       setTrackingEvents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="container w-full mx-auto">
//         {!shipment ? (
//           <div>
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                 Track a Shipment
//               </h1>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Enter your tracking number to see real-time updates on your
//                 shipment.
//               </p>
//             </div>

//             <div className="md:w-[50%] mx-auto space-y-6">
//               <Card>
//                 <CardContent>
//                   <form onSubmit={handleTrack} className="space-y-4">
//                     <div>
//                       <Label htmlFor="trackingNumber" className="pb-1">
//                         Tracking Number
//                       </Label>
//                       <Input
//                         id="trackingNumber"
//                         placeholder="Enter tracking number (e.g., AB12345678CD)"
//                         value={trackingNumber}
//                         onChange={(e) => setTrackingNumber(e.target.value)}
//                         className="text-center font-mono"
//                       />
//                     </div>
//                     {error && (
//                       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-auto text-center">
//                         {error}
//                       </div>
//                     )}
//                     <Button
//                       type="submit"
//                       className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         "Tracking..."
//                       ) : (
//                         <div className="flex items-center justify-center">
//                           <Search className="h-6 w-6 text-white mr-1" /> Track
//                           Shipment
//                         </div>
//                       )}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         ) : (
//           <PackageTracker
//             trackingNumber={trackingNumber}
//             setTrackingNumber={setTrackingNumber}
//             shipment={shipment}
//             trackingEvents={trackingEvents}
//             isLoading={isLoading}
//             error={error}
//             handleTrack={handleTrack}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
