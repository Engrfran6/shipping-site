"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Shipment} from "@/lib/types/database";
import {AlertCircle, CheckCircle, Package, Search} from "lucide-react";
import React from "react";
import {Badge} from "../ui/badge";

interface SidebarTrackerProps {
  shipment: Shipment | null;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  handleTrack: (e: React.FormEvent) => void;
}

export default function SidebarTracker({
  shipment,
  trackingNumber,
  setTrackingNumber,
  isLoading,
  error,
  handleTrack,
}: SidebarTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800";
      case "exception":
      case "hold":
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="space-y-5">
      <Card className="bg-white/70 backdrop-blur-md shadow-md border border-gray-100">
        <CardTitle className="hidden md:block text-2xl md:mx-5 text-gray-800">
          Track a Shipment
        </CardTitle>

        <CardContent>
          <form onSubmit={handleTrack} className="space-y-5">
            <div>
              <Label htmlFor="trackingNumber" className="pb-1 text-gray-700">
                Tracking Number
              </Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="text-center font-mono text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              {isLoading ? (
                "Tracking..."
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2" /> Track Package
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Shipment Overview */}
      {shipment && (
        <Card className="shadow-sm border border-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900">Package Details</CardTitle>
              <Badge className={getStatusColor(shipment.status)}>
                {getStatusIcon(shipment.status)}
                <span className="ml-1">{formatStatus(shipment.status)}</span>
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-500">
              Tracking: {shipment.tracking_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">From</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shipment.sender_name}
                  <br />
                  {shipment.sender_address}
                  <br />
                  {shipment.sender_city}, {shipment.sender_state} {shipment.sender_postal_code}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">To</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {shipment.recipient_name}
                  <br />
                  {shipment.recipient_address}
                  <br />
                  {shipment.recipient_city}, {shipment.recipient_state}{" "}
                  {shipment.recipient_postal_code}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Service</div>
                <div className="font-semibold text-gray-800">
                  {formatStatus(shipment.service_type)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Weight</div>
                <div className="font-semibold text-gray-800">{shipment.weight_kg} kg</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Est. Delivery</div>
                <div className="font-semibold text-gray-800">
                  {shipment.estimated_delivery_date
                    ? new Date(shipment.estimated_delivery_date).toLocaleDateString()
                    : "TBD"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
