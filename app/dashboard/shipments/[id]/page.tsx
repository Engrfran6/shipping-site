// app/dashboard/shipments/[id]/page.tsx
"use client";

import { ShipmentDetails } from "@/components/shipment-details/page";
import { useParams } from "next/navigation";

export default function ShipmentDetailsPage() {
  const { id } = useParams();
  return (
    <div className="mt-20">
      <ShipmentDetails shipmentId={id as string} />
    </div>
  );
}
