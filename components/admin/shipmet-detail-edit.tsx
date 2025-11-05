"use client";

import {createClient} from "@/lib/supabase/client";
import {Shipment} from "@/lib/types/database";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import {ShipmentEditForm} from "./shipment-edit-form";

interface ShipmentDetailEditProps {
  shipmentId?: string;
}

export default function ShipmentEditPage({shipmentId}: ShipmentDetailEditProps) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchShipment = async () => {
      try {
        // Fetch shipment details
        const {data: shipment, error} = await supabase
          .from("shipments")
          .select("*")
          .eq("id", shipmentId)
          .single();

        if (error || !shipment) {
          redirect("/admin/shipments");
        }

        setShipment(shipment);
      } catch (error: any) {
        setError(error.message || "Failed to load shipment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, []);

  console.log("shipment=======>", shipment);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading shipment...</div>;

  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  if (!shipment) return <div className="text-center py-10 text-gray-500">Shipment not found.</div>;

  return (
    <div className="">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Edit Shipment</h1>
        <p className="text-gray-600">Tracking: {shipment.tracking_number}</p>
      </div>

      <ShipmentEditForm shipment={shipment} />
    </div>
  );
}
