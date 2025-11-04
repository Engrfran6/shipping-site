"use client";

import type { Shipment, TrackingEvent } from "@/lib/types/database";
import React from "react";
import SidebarTracker from "./sidebar-tracker";
import TrackingHistory, { PaymentOption } from "./tracking-history";

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
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden shadow-lg min-h-screen">
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

// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import type { Shipment, TrackingEvent } from "@/lib/types/database";
// import { cn } from "@/lib/utils";
// import {
//   AlertCircle,
//   ArrowRight,
//   CheckCircle,
//   Package,
//   Search,
// } from "lucide-react";
// import React from "react";

// interface PackageTrackerProps {
//   trackingNumber: string;
//   setTrackingNumber: (value: string) => void;
//   shipment: Shipment | null;
//   trackingEvents: TrackingEvent[];
//   isLoading: boolean;
//   error: string | null;
//   handleTrack: (e: React.FormEvent) => void;
// }

// export function PackageTracker({
//   trackingNumber,
//   setTrackingNumber,
//   shipment,
//   trackingEvents,
//   isLoading,
//   error,
//   handleTrack,
// }: PackageTrackerProps) {
//   // --------------------------
//   // Helper functions
//   // --------------------------
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "delivered":
//         return "bg-green-100 text-green-800";
//       case "out_for_delivery":
//         return "bg-blue-100 text-blue-800";
//       case "in_transit":
//         return "bg-yellow-100 text-yellow-800";
//       case "exception":
//       case "hold":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "delivered":
//         return <CheckCircle className="h-4 w-4 text-green-600" />;
//       case "exception":
//         return <AlertCircle className="h-4 w-4 text-red-600" />;
//       default:
//         return <Package className="h-4 w-4 text-blue-600" />;
//     }
//   };

//   const formatStatus = (status: string) =>
//     status
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   // --------------------------
//   // Derived state
//   // --------------------------
//   const currentIndex = Math.min(trackingEvents.length - 1, 4);
//   const currentStatus = trackingEvents[currentIndex]?.event_type || "";
//   const currentLocation = trackingEvents[currentIndex]?.location || "";

//   // --------------------------
//   // Render
//   // --------------------------
//   return (
//     <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto md:px-4 md:py-6">
//       {/* Left: Search + Shipment Info */}
//       <div className="flex-1 space-y-8">
//         {/* Track Shipment */}
//         <Card className="bg-white/70 backdrop-blur-md shadow-md border border-gray-100">
//           <CardHeader>
//             <CardTitle className="text-2xl text-gray-800">
//               Track a Shipment
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleTrack} className="space-y-5">
//               <div>
//                 <Label htmlFor="trackingNumber" className="pb-1 text-gray-700">
//                   Tracking Number
//                 </Label>
//                 <Input
//                   id="trackingNumber"
//                   placeholder="Enter tracking number (e.g., AB12345678CD)"
//                   value={trackingNumber}
//                   onChange={(e) => setTrackingNumber(e.target.value)}
//                   className="text-center font-mono text-sm"
//                 />
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center text-sm">
//                   {error}
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
//               >
//                 {isLoading ? (
//                   "Tracking..."
//                 ) : (
//                   <div className="flex items-center justify-center">
//                     <Search className="h-5 w-5 mr-2" /> Track Package
//                   </div>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Shipment Overview */}
//         {shipment && (
//           <Card className="bg-white/80 backdrop-blur-md shadow-md border border-gray-100">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg text-gray-900">
//                   Package Details
//                 </CardTitle>
//                 <Badge className={getStatusColor(shipment.status)}>
//                   {getStatusIcon(shipment.status)}
//                   <span className="ml-1">{formatStatus(shipment.status)}</span>
//                 </Badge>
//               </div>
//               <CardDescription className="text-sm text-gray-500">
//                 Tracking: {shipment.tracking_number}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">From</h4>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {shipment.sender_name}
//                     <br />
//                     {shipment.sender_address}
//                     <br />
//                     {shipment.sender_city}, {shipment.sender_state}{" "}
//                     {shipment.sender_postal_code}
//                   </p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">To</h4>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {shipment.recipient_name}
//                     <br />
//                     {shipment.recipient_address}
//                     <br />
//                     {shipment.recipient_city}, {shipment.recipient_state}{" "}
//                     {shipment.recipient_postal_code}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
//                 <div className="text-center">
//                   <div className="text-xs text-gray-500 uppercase tracking-wide">
//                     Service
//                   </div>
//                   <div className="font-semibold text-gray-800">
//                     {formatStatus(shipment.service_type)}
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xs text-gray-500 uppercase tracking-wide">
//                     Weight
//                   </div>
//                   <div className="font-semibold text-gray-800">
//                     {shipment.weight_kg} kg
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xs text-gray-500 uppercase tracking-wide">
//                     Est. Delivery
//                   </div>
//                   <div className="font-semibold text-gray-800">
//                     {shipment.estimated_delivery_date
//                       ? new Date(
//                           shipment.estimated_delivery_date
//                         ).toLocaleDateString()
//                       : "TBD"}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Right: Tracking Timeline */}
//       {trackingEvents.length > 0 && (
//         <div className="flex-2 space-y-6">
//           <Card className="bg-white/80 backdrop-blur-md shadow-md border border-gray-100">
//             <CardHeader>
//               <CardTitle className="text-lg text-gray-900">
//                 Tracking Progress
//               </CardTitle>
//               <CardDescription>
//                 Real-time updates on your package journey
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <div className="space-y-8">
//                 {/* Progress bar */}
//                 <div className="relative w-4/5 mx-auto mt-4">
//                   <div className="relative h-1 bg-gray-200 rounded-full">
//                     <div
//                       className={cn(
//                         "absolute h-1 rounded-full transition-all duration-700 ease-in-out",
//                         currentStatus === "delivered"
//                           ? "bg-green-600"
//                           : "bg-indigo-600"
//                       )}
//                       style={{
//                         width: `${
//                           (Math.min(trackingEvents.length, 5) - 1) * 25
//                         }%`,
//                       }}
//                     ></div>
//                   </div>

//                   {/* Dots */}
//                   <div
//                     className="absolute top-0 left-0 w-full flex justify-between"
//                     style={{ transform: "translateY(-6px)" }}
//                   >
//                     {[...Array(5)].map((_, index) => {
//                       const isPassed = index < trackingEvents.length - 1;
//                       const isCurrent = index === trackingEvents.length - 1;

//                       return (
//                         <div
//                           key={index}
//                           className="relative flex items-center justify-center"
//                         >
//                           {isCurrent ? (
//                             <div className="relative flex items-center justify-center">
//                               {/* Ping Ring */}
//                               <span
//                                 className={cn(
//                                   "absolute inline-flex rounded-full opacity-75 animate-ping",
//                                   currentStatus === "delivered"
//                                     ? "bg-green-200 h-6 w-6"
//                                     : "bg-indigo-300 h-6 w-6"
//                                 )}
//                               ></span>
//                               {/* Core Dot */}
//                               <div
//                                 className={cn(
//                                   "relative flex items-center justify-center rounded-full border-2 h-4 w-4",
//                                   currentStatus === "delivered"
//                                     ? "bg-green-600 border-green-600"
//                                     : "bg-indigo-600 border-indigo-600"
//                                 )}
//                               >
//                                 {currentStatus === "delivered" ? (
//                                   <CheckCircle className="text-white h-3 w-3" />
//                                 ) : (
//                                   <ArrowRight className="text-white h-3 w-3" />
//                                 )}
//                               </div>
//                             </div>
//                           ) : (
//                             <div
//                               className={cn(
//                                 "flex items-center justify-center rounded-full border-2 transition-all duration-300 w-3 h-3",
//                                 isPassed && currentStatus !== "delivered"
//                                   ? "bg-indigo-600 border-indigo-600"
//                                   : isPassed && currentStatus === "delivered"
//                                   ? "bg-green-600 border-green-600"
//                                   : "bg-gray-300 border-gray-300"
//                               )}
//                             ></div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Status Text */}
//                   {shipment && (
//                     <div className="flex flex-col items-center mt-10 space-y-1">
//                       <p
//                         className={cn(
//                           "text-2xl font-bold capitalize",
//                           currentStatus === "delivered"
//                             ? "text-green-700"
//                             : "text-indigo-700"
//                         )}
//                       >
//                         {formatStatus(currentStatus)}
//                       </p>
//                       <p className="text-sm text-gray-600 italic">
//                         {currentStatus === "delivered"
//                           ? `${shipment.recipient_name}, ${shipment.recipient_city}`
//                           : currentLocation || "—"}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* History Table */}
//                 <div className="mt-10">
//                   <h3 className="text-lg font-semibold mb-4 text-gray-900">
//                     Travel History
//                   </h3>
//                   <div className="border rounded-lg overflow-hidden">
//                     <div className="grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
//                       <div className="col-span-2">Date/Time</div>
//                       <div className="col-span-7">Activity</div>
//                       <div className="col-span-3 text-right">Location</div>
//                     </div>

//                     <div className="divide-y">
//                       {[...trackingEvents].reverse().map((event) => {
//                         const date = new Date(event.created_at);
//                         const time = date.toLocaleTimeString("en-US", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: false,
//                         });
//                         const dateStr = date.toLocaleDateString("en-US", {
//                           weekday: "long",
//                           month: "short",
//                           day: "numeric",
//                         });

//                         return (
//                           <div key={event.id}>
//                             <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 border-b">
//                               {dateStr}
//                             </div>
//                             <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
//                               <div className="col-span-2 text-sm text-gray-600">
//                                 {time}
//                               </div>
//                               <div className="col-span-7">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {formatStatus(event.event_type)}
//                                 </div>
//                                 {event.event_description && (
//                                   <div className="text-xs text-gray-500 mt-1">
//                                     {event.event_description}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="col-span-3 text-right text-sm text-gray-600">
//                                 {event.location || "-"}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import type React from "react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import type { Shipment, TrackingEvent } from "@/lib/types/database";
// import { cn } from "@/lib/utils";
// import {
//   AlertCircle,
//   ArrowRight,
//   CheckCircle,
//   Clock,
//   Package,
//   Search,
// } from "lucide-react";

// interface PackageTrackerProps {
//   trackingNumber: string;
//   setTrackingNumber: (value: string) => void;
//   shipment: Shipment | null;
//   trackingEvents: TrackingEvent[];
//   isLoading: boolean;
//   error: string | null;
//   handleTrack: (e: React.FormEvent) => void;
// }

// export function PackageTracker({
//   trackingNumber,
//   setTrackingNumber,
//   shipment,
//   trackingEvents,
//   isLoading,
//   error,
//   handleTrack,
// }: PackageTrackerProps) {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "delivered":
//         return "bg-green-100 text-green-800";
//       case "out_for_delivery":
//         return "bg-blue-100 text-blue-800";
//       case "in_transit":
//         return "bg-yellow-100 text-yellow-800";
//       case "exception":
//         return "bg-red-100 text-red-800";
//       case "cancelled":
//         return "bg-gray-100 text-gray-800";
//       case "hold":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "delivered":
//         return <CheckCircle className="h-4 w-4 text-green-600" />;
//       case "exception":
//         return <AlertCircle className="h-4 w-4 text-red-600" />;
//       default:
//         return <Package className="h-4 w-4 text-blue-600" />;
//     }
//   };

//   const formatStatus = (status: string) => {
//     return status
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   const currentIndex = Math.min(trackingEvents.length - 1, 4);
//   const currentStatus = trackingEvents[currentIndex]?.event_type || "";
//   const currentLocation = trackingEvents[currentIndex]?.location || "";

//   return (
//     <div className="flex gap-5 max-w-6xl mx-auto space-y-6">
//       <div className="w-2/3 space-y-6 border rounded-lg p-4 bg-white/35 backdrop-blur-sm shadow-sm">
//         <p className="text-2xl text-gray-700">Track a Shipment</p>

//         <div className="px-5 border-2 rounded-lg py-6 bg-white/50 backdrop-blur-sm shadow-sm">
//           <form onSubmit={handleTrack} className="space-y-4">
//             <div>
//               <Label htmlFor="trackingNumber" className="pb-1">
//                 Tracking Number
//               </Label>
//               <Input
//                 id="trackingNumber"
//                 placeholder="Enter tracking number (e.g., AB12345678CD)"
//                 value={trackingNumber}
//                 onChange={(e) => setTrackingNumber(e.target.value)}
//                 className="text-center font-mono"
//               />
//             </div>
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-auto text-center">
//                 {error}
//               </div>
//             )}
//             <Button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 "Tracking..."
//               ) : (
//                 <div className="flex items-center justify-center">
//                   <Search className="h-6 w-6 text-white mr-1" /> Track Package
//                 </div>
//               )}
//             </Button>
//           </form>
//         </div>

//         {/* Shipment Overview */}
//         <div>
//           <p className="py-2 text-2xl text-gray-700">My Shipments</p>
//           {shipment && (
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-xl">Package Details</CardTitle>
//                   <Badge className={getStatusColor(shipment.status)}>
//                     {getStatusIcon(shipment.status)}
//                     <span className="ml-1">
//                       {formatStatus(shipment.status)}
//                     </span>
//                   </Badge>
//                 </div>
//                 <CardDescription>
//                   Tracking: {shipment.tracking_number}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">From</h4>
//                     <p className="text-sm text-gray-600">
//                       {shipment.sender_name}
//                       <br />
//                       {shipment.sender_address}
//                       <br />
//                       {shipment.sender_city}, {shipment.sender_state}{" "}
//                       {shipment.sender_postal_code}
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">To</h4>
//                     <p className="text-sm text-gray-600">
//                       {shipment.recipient_name}
//                       <br />
//                       {shipment.recipient_address}
//                       <br />
//                       {shipment.recipient_city}, {shipment.recipient_state}{" "}
//                       {shipment.recipient_postal_code}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
//                   <div className="text-center">
//                     <div className="text-sm text-gray-500">Service</div>
//                     <div className="font-semibold">
//                       {formatStatus(shipment.service_type)}
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-sm text-gray-500">Weight</div>
//                     <div className="font-semibold">{shipment.weight_kg} kg</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-sm text-gray-500">Est. Delivery</div>
//                     <div className="font-semibold">
//                       {shipment.estimated_delivery_date
//                         ? new Date(
//                             shipment.estimated_delivery_date
//                           ).toLocaleDateString()
//                         : "TBD"}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       <div>
//         {trackingEvents.length > 0 && (
//           <div className="w-full space-y-6">
//             {/* Tracking Timeline */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-xl">Tracking History</CardTitle>
//                 <CardDescription>
//                   Real-time updates on your package journey
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {trackingEvents.length > 0 ? (
//                   <div className="space-y-6">
//                     <div className="relative w-2/3 mx-auto">
//                       {/* Progress bar background */}
//                       <div className="relative h-1 bg-gray-200 rounded-full w-full">
//                         <div
//                           className={cn(
//                             `absolute h-1 rounded-full transition-all duration-500`,
//                             currentStatus === "delivered"
//                               ? "bg-green-600"
//                               : "bg-purple-700"
//                           )}
//                           style={{
//                             width: `${
//                               (Math.min(trackingEvents.length, 5) - 1) * 25
//                             }%`,
//                           }}
//                         ></div>
//                       </div>

//                       {/* Progress dots */}
//                       <div
//                         className="absolute top-0 left-0 w-full flex justify-between"
//                         style={{ transform: "translateY(-6px)" }}
//                       >
//                         {[...Array(5)].map((_, index) => {
//                           const isPassed = index < trackingEvents.length - 1;
//                           const isCurrent = index === trackingEvents.length - 1;
//                           const isUpcoming = index >= trackingEvents.length;

//                           return (
//                             <div
//                               key={index}
//                               className="flex items-center justify-center relative"
//                             >
//                               {/* ✅ For the CURRENT event */}
//                               {isCurrent ? (
//                                 <div className="relative flex items-center justify-center">
//                                   {/* Animated ring (only this pings) */}
//                                   <span
//                                     className={cn(
//                                       "absolute inline-flex rounded-full opacity-75",
//                                       currentStatus === "delivered"
//                                         ? "bg-green-200 h-6 w-6"
//                                         : "bg-green-300 h-6 w-6 animate-ping"
//                                     )}
//                                   ></span>

//                                   {/* Static center dot */}
//                                   <div
//                                     className={cn(
//                                       "relative flex items-center justify-center rounded-full border-2 ",
//                                       currentStatus === "delivered"
//                                         ? "bg-green-600 border-green-600 h-4 w-4"
//                                         : "bg-purple-600 border-purple-600 h-5 w-5"
//                                     )}
//                                   >
//                                     {currentStatus === "delivered" ? (
//                                       <Package className="text-white font-extrabold text-xs" />
//                                     ) : (
//                                       <ArrowRight className="text-white font-extrabold text-xs" />
//                                     )}
//                                   </div>
//                                 </div>
//                               ) : (
//                                 // ✅ For other events (passed or upcoming)
//                                 <div
//                                   className={cn(
//                                     "flex items-center justify-center rounded-full border-2 transition-all duration-300 w-3 h-3",
//                                     isPassed && currentStatus !== "delivered"
//                                       ? "bg-purple-600 border-purple-600"
//                                       : isPassed &&
//                                         currentStatus === "delivered"
//                                       ? "bg-green-600 border-green-600"
//                                       : isUpcoming &&
//                                         "bg-gray-300 border-gray-300"
//                                   )}
//                                 ></div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>

//                       {shipment && (
//                         <div className="flex flex-col gap-2 items-center mt-8">
//                           <p className="text-center text-2xl text-purple-800 font-bold first-letter:capitalize">
//                             {formatStatus(currentStatus)}
//                           </p>
//                           <div className="text-xs italic">
//                             {currentStatus === "delivered" ? (
//                               <p className="text-sm text-gray-600">
//                                 {shipment.recipient_name}
//                                 <br />
//                                 {shipment.recipient_address}
//                                 <br />
//                                 {shipment.recipient_city},{" "}
//                                 {shipment.recipient_state}{" "}
//                                 {shipment.recipient_postal_code}
//                               </p>
//                             ) : (
//                               <p>{currentLocation}</p>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="mt-8">
//                       <h3 className="text-lg font-semibold mb-4 text-gray-900">
//                         Travel History
//                       </h3>
//                       <div className="border rounded-lg overflow-hidden">
//                         {/* Table header */}
//                         <div className="grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
//                           <div className="col-span-2">Date/Time</div>
//                           <div className="col-span-7">Activity</div>
//                           <div className="col-span-3 text-right">Location</div>
//                         </div>

//                         {/* Table rows */}
//                         <div className="divide-y">
//                           {[...trackingEvents].reverse().map((event, index) => {
//                             const eventDate = new Date(event.created_at);
//                             const timeString = eventDate.toLocaleTimeString(
//                               "en-US",
//                               {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                                 hour12: false,
//                               }
//                             );
//                             const dateString = eventDate.toLocaleDateString(
//                               "en-US",
//                               {
//                                 weekday: "long",
//                                 month: "short",
//                                 day: "numeric",
//                               }
//                             );

//                             // Check if this is a new day compared to previous event
//                             const prevEvent =
//                               index > 0
//                                 ? trackingEvents[trackingEvents.length - index]
//                                 : null;
//                             const isNewDay =
//                               !prevEvent ||
//                               new Date(prevEvent.created_at).toDateString() !==
//                                 eventDate.toDateString();

//                             return (
//                               <div key={event.id}>
//                                 {/* Date separator */}
//                                 {isNewDay && (
//                                   <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 border-b">
//                                     {dateString}
//                                   </div>
//                                 )}

//                                 {/* Event row */}
//                                 <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
//                                   <div className="col-span-2 text-sm text-gray-600">
//                                     {timeString}
//                                   </div>
//                                   <div className="col-span-7">
//                                     <div className="text-sm font-medium text-gray-900">
//                                       {formatStatus(event.event_type)}
//                                     </div>
//                                     {event.event_description && (
//                                       <div className="text-xs text-gray-500 mt-1">
//                                         {event.event_description}
//                                       </div>
//                                     )}
//                                   </div>
//                                   <div className="col-span-3 text-right text-sm text-gray-600">
//                                     {event.location || "-"}
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <Clock className="h-8 w-8 mx-auto mb-2" />
//                     <p>No tracking events yet</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
