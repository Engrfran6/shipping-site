"use client";

import type {Shipment, TrackingEvent} from "@/lib/types/database";
import React from "react";
import SidebarTracker from "./sidebar-tracker";
import TrackingHistory, {PaymentOption} from "./tracking-history";

interface PackageTrackerProps {
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  shipment: Shipment;
  trackingEvents: TrackingEvent[] | [];
  isLoading: boolean;
  error: string | null;
  handleTrack: (e: React.FormEvent) => void;
  paymentOptions?: PaymentOption[];
}

export function PackageTracker({
  trackingNumber,
  setTrackingNumber,
  shipment,
  trackingEvents,
  isLoading,
  error,
  handleTrack,
  paymentOptions,
}: PackageTrackerProps) {
  // --------------------------
  // Layout
  // --------------------------
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden shadow-lg min-h-screen space-y-5">
      {/* LEFT COLUMN — Fixed / Scrollable independently */}
      <div className="w-full md:w-1/3 md:p-6 space-y-8 bg-white/70 backdrop-blur-md border-r border-gray-200 md:sticky md:top-0 md:self-start h-fit md:h-screen overflow-y-auto">
        {/* Track Shipment */}
        <SidebarTracker
          shipment={shipment}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
          isLoading={isLoading}
          error={error}
          handleTrack={handleTrack}
        />
      </div>

      {/* RIGHT COLUMN — Scrollable Timeline */}
      <div className="w-full md:w-2/3 overflow-y-auto scroll-smooth md:p-6 space-y-6 bg-gradient-to-br from-indigo-50 to-blue-100">
        <TrackingHistory
          shipment={shipment}
          trackingEvents={trackingEvents}
          paymentOptions={paymentOptions}
        />
      </div>
    </div>
  );
}
