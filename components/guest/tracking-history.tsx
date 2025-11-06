"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import type {Shipment, TrackingEvent} from "@/lib/types/database";
import {cn} from "@/lib/utils";
import {AlertTriangle, ArrowRight, CheckCircle, CheckCircleIcon, CreditCard, X} from "lucide-react";
import React, {useState} from "react";
import {Button} from "../ui/button";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";

export interface PaymentOption {
  type: string;
  label?: string;
  account?: string;
  bank?: string;
  email?: string;
  note?: string;
}

interface TrackerHistoryProps {
  shipment: Shipment;
  trackingEvents: TrackingEvent[];
  paymentOptions?: PaymentOption[]; // 🔹 comes from backend
}

const TrackingHistory = ({shipment, trackingEvents, paymentOptions = []}: TrackerHistoryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedException, setSelectedException] = useState<TrackingEvent | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const currentIndex = Math.min(trackingEvents.length - 1, 4);
  const currentStatus = trackingEvents[currentIndex]?.event_type || "";
  const currentLocation = trackingEvents[currentIndex]?.location || "";

  const handleResolveClick = (event: TrackingEvent) => {
    setSelectedException(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedException(null);
    setProofFile(null);
    setHasPaid(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProofFile(file);
  };

  const handleConfirmPayment = () => {
    if (!proofFile) {
      setAlertMessage("Please upload your proof of payment first.");
      setShowAlert(true);
      return;
    }

    setIsUploading(true);

    // Simulate upload (replace with Supabase storage or S3 later)
    setTimeout(() => {
      setIsUploading(false);
      setAlertMessage("Payment proof uploaded successfully. We'll verify shortly!");
      setShowAlert(true);
      closeModal();
    }, 2000);
  };

  return (
    <div>
      {trackingEvents.length > 0 && (
        <>
          <Card className="bg-white/80 backdrop-blur-md shadow-md border border-gray-100">
            <CardHeader className="flex px-4 items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg text-gray-900">Tracking Progress</CardTitle>
                <CardDescription>Real-time updates on your package journey</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-4">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="relative w-4/5 mx-auto mt-4">
                  <div className="relative h-1 bg-gray-200 rounded-full">
                    <div
                      className={cn(
                        "absolute h-1 rounded-full transition-all duration-700 ease-in-out",
                        currentStatus === "delivered" ? "bg-green-600" : "bg-indigo-600"
                      )}
                      style={{
                        width: `${(Math.min(trackingEvents.length, 5) - 1) * 25}%`,
                      }}></div>
                  </div>

                  {/* Progress Dots */}
                  <div
                    className="absolute top-0 left-0 w-full flex justify-between"
                    style={{transform: "translateY(-6px)"}}>
                    {[...Array(5)].map((_, index) => {
                      const isPassed = index < trackingEvents.length - 1;
                      const isCurrent = index === trackingEvents.length - 1;

                      return (
                        <div key={index} className="relative flex items-center justify-center">
                          {isCurrent ? (
                            <div className="relative flex items-center justify-center">
                              <span
                                className={cn(
                                  "absolute inline-flex rounded-full opacity-75 animate-ping",
                                  currentStatus === "delivered"
                                    ? "bg-green-200 h-6 w-6"
                                    : "bg-indigo-300 h-6 w-6"
                                )}></span>
                              <div
                                className={cn(
                                  "relative flex items-center justify-center rounded-full border-2 h-4 w-4",
                                  currentStatus === "delivered"
                                    ? "bg-green-600 border-green-600"
                                    : "bg-indigo-600 border-indigo-600"
                                )}>
                                {currentStatus === "delivered" ? (
                                  <CheckCircle className="text-white h-3 w-3" />
                                ) : (
                                  <ArrowRight className="text-white h-3 w-3" />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "flex items-center justify-center rounded-full border-2 transition-all duration-300 w-3 h-3",
                                isPassed && currentStatus !== "delivered"
                                  ? "bg-indigo-600 border-indigo-600"
                                  : isPassed && currentStatus === "delivered"
                                  ? "bg-green-600 border-green-600"
                                  : "bg-gray-300 border-gray-300"
                              )}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Current Status Text */}
                  {shipment && (
                    <div className="flex flex-col items-center mt-6 space-y-1">
                      <p
                        className={cn(
                          "text-2xl capitalize",
                          currentStatus === "delivered"
                            ? "text-green-700"
                            : currentStatus === "exception"
                            ? "text-red-800"
                            : "text-indigo-700"
                        )}>
                        {currentStatus === "exception" ? (
                          <div className="text-sm">
                            An {formatStatus(currentStatus)} has occured: {""}
                            <span className="underline cursor-pointer italic">Shipment</span> On
                            Hold
                          </div>
                        ) : (
                          formatStatus(currentStatus)
                        )}
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        {currentStatus === "delivered"
                          ? `${shipment.recipient_name}, ${shipment.recipient_city}`
                          : currentLocation || "—"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Travel History */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Travel History</h3>
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
                      <div className="flex flex-col md:flex-row col-span-2">
                        <span>Date/</span>
                        <span>Time</span>
                      </div>
                      <div className="col-span-7">Activity</div>
                      <div className="col-span-3 text-right">Location</div>
                    </div>

                    <div className="divide-y">
                      {[...trackingEvents].reverse().map((event) => {
                        const date = new Date(event.created_at);
                        const time = date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        });
                        const dateStr = date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        });

                        return (
                          <div key={event.id}>
                            <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                              {dateStr}
                            </div>
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                              <div className="col-span-2 text-sm text-gray-600">{time}</div>
                              <div className="col-span-7">
                                <div className="flex items-center text-sm font-medium text-gray-900">
                                  {formatStatus(event.event_type)}

                                  {event.event_type === "delivered" && (
                                    <CheckCircleIcon className="text-green-600 font-bold h-4 w-4 ml-2" />
                                  )}

                                  {event.event_type === "exception" && (
                                    <div className="inline-flex items-center ml-2 text-red-600">
                                      <AlertTriangle className="h-4 w-4" />
                                      <button
                                        onClick={() => handleResolveClick(event)}
                                        className="hover:underline ml-2">
                                        Resolve
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {event.event_description && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {event.event_description}
                                  </div>
                                )}
                              </div>
                              <div className="col-span-3 text-right text-sm text-gray-600">
                                {event.location || "-"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exception Modal */}
          {showModal && selectedException && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fade-in">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <AlertTriangle className="text-red-500 h-5 w-5 mr-2" />
                    Exception Resolution
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    <strong>Reason:</strong>{" "}
                    {selectedException.event_description ||
                      "This shipment encountered an unexpected issue."}
                  </p>

                  {/* <p className="text-gray-600 text-sm leading-relaxed">
                    To continue processing, please complete one of the payment
                    options below and upload your proof.
                  </p> */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <strong>How to Resolve:</strong> Please complete the pending payment to continue
                    your shipment process. Once payment is received, the delivery will resume within
                    24–48 hours.
                  </p>

                  {/* Dynamic Payment Options */}
                  <div className="space-y-3 overflow-y-auto max-h-80">
                    {paymentOptions.length > 0 ? (
                      <RadioGroup
                        value={selectedPaymentOption}
                        onValueChange={(val) => setSelectedPaymentOption(val)} // handle selection
                        className="space-y-3 my-3 mx-1">
                        {paymentOptions.map((option, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex items-start justify-between border rounded-md p-4 bg-gray-50 cursor-pointer",
                              selectedPaymentOption === option.type && "ring-2 ring-indigo-500"
                            )}>
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-1">{option.label}</h3>
                              {option.account && (
                                <p className="text-sm text-gray-700">
                                  <strong>Account:</strong> {option.account}
                                </p>
                              )}
                              {option.bank && (
                                <p className="text-sm text-gray-700">
                                  <strong>Bank:</strong> {option.bank}
                                </p>
                              )}
                              {option.email && (
                                <p className="text-sm text-gray-700">
                                  <strong>Email:</strong> {option.email}
                                </p>
                              )}
                              {option.note && (
                                <p className="text-xs text-gray-500 italic mt-1">{option.note}</p>
                              )}
                            </div>

                            <RadioGroupItem
                              value={option.type}
                              id={`option-${i}`}
                              className="border-2 border-blue-300 checked:border-indigo-600 checked:bg-indigo-600 w-5 h-5 rounded-full mt-1"
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No payment options currently available. Please contact support.
                      </p>
                    )}
                  </div>

                  {/* Payment Confirmation */}
                  {paymentOptions && paymentOptions.length > 0 && (
                    <div>
                      {!hasPaid ? (
                        <Button
                          onClick={() => setHasPaid(true)}
                          disabled={!selectedPaymentOption}
                          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          I’ve Made the Payment
                        </Button>
                      ) : (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm text-gray-700">
                            Upload your payment receipt or send it via email:
                          </p>

                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleUpload}
                            className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1"
                          />

                          <p className="text-xs text-gray-500">
                            Or email your proof to{" "}
                            <a
                              href={`mailto:payments@swiftship.com?subject=${encodeURIComponent(
                                `Proof of Payment for ${shipment.recipient_name} - ${shipment.recipient_city}`
                              )}&body=${encodeURIComponent(
                                `Hello,\n\nPlease find attached the proof of payment for the shipment to ${shipment.recipient_name}, ${shipment.recipient_city}.\n\nTracking/Reference: \n\nThank you.`
                              )}`}
                              className="font-semibold text-indigo-600 underline">
                              payments@swiftship.com
                            </a>
                          </p>

                          <Button
                            onClick={handleConfirmPayment}
                            disabled={isUploading}
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                            {isUploading ? "Uploading..." : "Submit Proof of Payment"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                    <AlertDialogContent className="max-2/3 bg-red-50 border border-red-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{/* Notification */}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {alertMessage}
                          <p className="text-xs text-gray-500 mt-2">
                            Or email your proof to{" "}
                            <a
                              href={`mailto:payments@swiftship.com?subject=${encodeURIComponent(
                                `Proof of Payment for ${shipment.recipient_name} - ${shipment.recipient_city}`
                              )}&body=${encodeURIComponent(
                                `Hello,\n\nPlease find attached the proof of payment for the shipment to ${shipment.recipient_name}, ${shipment.recipient_city}.\n\nTracking/Reference: \n\nThank you.`
                              )}`}
                              className="font-semibold text-indigo-600 underline">
                              payments@swiftship.com
                            </a>
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={() => setShowAlert(false)}
                          className="bg-red-600 hover:bg-red-700 text-white">
                          OK
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackingHistory;

// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import type { Shipment, TrackingEvent } from "@/lib/types/database";
// import { cn } from "@/lib/utils";
// import {
//   AlertTriangle,
//   ArrowRight,
//   CheckCircle,
//   CreditCard,
//   X,
// } from "lucide-react";
// import { useState } from "react";

// interface TrackerHistoryProps {
//   shipment: Shipment;
//   trackingEvents: TrackingEvent[];
// }

// const TrackingHistory = ({ shipment, trackingEvents }: TrackerHistoryProps) => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedException, setSelectedException] =
//     useState<TrackingEvent | null>(null);

//   const formatStatus = (status: string) =>
//     status
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");

//   const currentIndex = Math.min(trackingEvents.length - 1, 4);
//   const currentStatus = trackingEvents[currentIndex]?.event_type || "";
//   const currentLocation = trackingEvents[currentIndex]?.location || "";

//   const handleResolveClick = (event: TrackingEvent) => {
//     setSelectedException(event);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedException(null);
//   };

//   return (
//     <div>
//       {trackingEvents.length > 0 && (
//         <>
//           <Card className="bg-white/80 backdrop-blur-md shadow-md border border-gray-100">
//             <CardHeader className="flex items-center justify-between">
//               <div className="space-y-2">
//                 <CardTitle className="text-lg text-gray-900">
//                   Tracking Progress
//                 </CardTitle>
//                 <CardDescription>
//                   Real-time updates on your package journey
//                 </CardDescription>
//               </div>

//               <p className="text-blue-600 hover:underline cursor-pointer text-sm mt-6">
//                 Need help?
//               </p>
//             </CardHeader>

//             <CardContent>
//               <div className="space-y-8">
//                 {/* Progress Bar */}
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

//                   {/* Progress Dots */}
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
//                               <span
//                                 className={cn(
//                                   "absolute inline-flex rounded-full opacity-75 animate-ping",
//                                   currentStatus === "delivered"
//                                     ? "bg-green-200 h-6 w-6"
//                                     : "bg-indigo-300 h-6 w-6"
//                                 )}
//                               ></span>
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

//                   {/* Current Status Text */}
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

//                 {/* Travel History */}
//                 <div className="mt-10">
//                   <h3 className="text-lg font-semibold mb-4 text-gray-900">
//                     Travel History
//                   </h3>
//                   <div className="border rounded-lg overflow-hidden shadow-sm">
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
//                                   {event.event_type === "exception" && (
//                                     <div className="inline-flex items-center ml-2 text-red-600">
//                                       <AlertTriangle className="h-4 w-4" />
//                                       <button
//                                         onClick={() =>
//                                           handleResolveClick(event)
//                                         }
//                                         className="hover:underline ml-2"
//                                       >
//                                         Resolve
//                                       </button>
//                                     </div>
//                                   )}
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

//           {/* Modal */}
//           {showModal && selectedException && (
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fade-in">
//                 <button
//                   onClick={closeModal}
//                   className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>

//                 <div className="space-y-4">
//                   <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                     <AlertTriangle className="text-red-500 h-5 w-5 mr-2" />
//                     Exception Resolution
//                   </h2>

//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     <strong>Reason:</strong>{" "}
//                     {selectedException.event_description ||
//                       "This shipment encountered an unexpected issue."}
//                   </p>

//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     <strong>How to Resolve:</strong> Please complete the pending
//                     payment to continue your shipment process. Once payment is
//                     received, the delivery will resume within 24–48 hours.
//                   </p>

//                   <div className="border rounded-md p-4 bg-gray-50">
//                     <h3 className="font-semibold text-gray-800 mb-2">
//                       Payment Details
//                     </h3>
//                     <p className="text-sm text-gray-700">
//                       <strong>Amount:</strong> $25.00 USD
//                     </p>
//                     <p className="text-sm text-gray-700">
//                       <strong>Account Name:</strong> GlobalShip Logistics
//                     </p>
//                     <p className="text-sm text-gray-700">
//                       <strong>Account Number:</strong> 1234-5678-9012
//                     </p>
//                     <p className="text-sm text-gray-700">
//                       <strong>Bank:</strong> Citibank International
//                     </p>
//                   </div>

//                   <button
//                     className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
//                     onClick={() => {
//                       alert("Redirecting to payment gateway...");
//                       closeModal();
//                     }}
//                   >
//                     <CreditCard className="h-4 w-4" />
//                     Make Payment
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default TrackingHistory;
