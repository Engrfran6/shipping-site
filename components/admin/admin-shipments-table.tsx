"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {createClient} from "@/lib/supabase/client";
import {Delete, Edit, Package, Search} from "lucide-react";
import {useEffect, useState} from "react";
import {PaymentOption} from "../guest/tracking-history";
import {ShipmentDetailView} from "./shipment-detail-view";
import ShipmentEditPage from "./shipmet-detail-edit";

interface ShipmentWithUser {
  id: string;
  tracking_number: string;
  status: string;
  service_type: string;
  total_cost: number;
  created_at: string;
  sender_name: string;
  recipient_name: string;
  recipient_city: string;
  recipient_state: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

export function AdminShipmentsTable() {
  const [shipments, setShipments] = useState<ShipmentWithUser[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<ShipmentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<ShipmentWithUser | null>(null);
  const [selectedShipment2, setSelectedShipment2] = useState<ShipmentWithUser | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  useEffect(() => {
    fetchShipments();
    fetchPaymentOptions();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [shipments, searchTerm, statusFilter]);

  const fetchLatestPaymentForShipment = async (shipmentId: string) => {
    const supabase = createClient();

    // 1️⃣ Get the latest tracking event for this shipment
    const {data: latestEvent, error: eventError} = await supabase
      .from("tracking_events")
      .select("id")
      .eq("shipment_id", shipmentId)
      .order("created_at", {ascending: false})
      .limit(1)
      .maybeSingle();

    if (eventError || !latestEvent) return null;

    // 2️⃣ Get payment data for that event
    const {data: payments, error: paymentError} = await supabase
      .from("tracking_event_payments")
      .select("amount, payment_method")
      .eq("tracking_event_id", latestEvent.id)
      .maybeSingle();

    if (paymentError || !payments) return null;

    return payments;
  };

  const fetchPaymentOptions = async () => {
    const supabase = createClient();
    try {
      const {data, error} = await supabase
        .from("payment_options")
        .select("*")
        .order("created_at", {ascending: true});

      if (error) throw error;

      setPaymentOptions(data || []);
    } catch (err) {
      setError("Failed to fetch payment options:");
    }
  };

  const fetchShipments = async () => {
    try {
      const supabase = createClient();
      const {data, error} = await supabase
        .from("shipments")
        .select(
          `*,
          profiles:user_id (
            full_name,
            email
          )
        `
        )
        .order("created_at", {ascending: false});

      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      setError(`Error fetching shipments, ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((shipment) => shipment.status === statusFilter);
    }

    setFilteredShipments(filtered);
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipment || !newStatus) return;

    try {
      const supabase = createClient();

      const {error} = await supabase.rpc("create_tracking_event", {
        p_shipment_id: selectedShipment.id,
        p_event_type: newStatus,
        p_event_description: eventDescription,
        p_location: eventLocation || null,
        p_payment_amount: paymentAmount || null,
        p_payment_methods: paymentMethods.length ? paymentMethods : null,
      });

      if (error) throw error;

      await fetchShipments();

      setUpdateDialogOpen(false);
      setSelectedShipment(null);
      setNewStatus("");
      setEventDescription("");
      setEventLocation("");
      setPaymentMethods([]);
      setPaymentAmount(null);
    } catch (error: any) {
      setError(`Error updating shipment, ${error.message}`);
    }
  };

  const handleDeleteShipment = async () => {
    try {
      const supabase = createClient();
      // Delete shipment
      const {error} = await supabase.from("shipments").delete().eq("id", selectedShipment?.id);

      if (error) throw error;

      // Refresh shipments
      await fetchShipments();

      // Reset form
      setUpdateDialogOpen(false);
      setSelectedShipment(null);
      setNewStatus("");
      setEventDescription("");
      setEventLocation("");
    } catch (error: any) {
      setError(`Error deleting shipment, ${error.message}`);
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
      case "hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Shipments ({filteredShipments.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tracking, user, sender, or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="exception">Exception</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-scroll">
          {filteredShipments.length > 0 ? (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <div
                  onClick={() => {
                    setSelectedShipment(shipment);
                    setSelectedShipment2(shipment);
                    setDetailsDialogOpen(true);
                  }}
                  key={shipment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Package className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{shipment.tracking_number}</p>
                        <p
                          className="text-sm text-gray-600"
                          title={
                            shipment.profiles
                              ? `${shipment.profiles.full_name || ""}${
                                  shipment.profiles.full_name ? " — " : ""
                                }${shipment.profiles.email || ""}`
                              : "Guest"
                          }>
                          User:{" "}
                          {(() => {
                            const email = shipment.profiles?.email;
                            if (!email) return "Guest";
                            const [local, domain] = email.split("@");
                            if (!domain) return email;
                            const maxLocal = 4;
                            const shortLocal =
                              local.length <= maxLocal ? local : `${local.slice(0, maxLocal)}...`;
                            return `${shortLocal}@${domain}`;
                          })()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {shipment.sender_name} → {shipment.recipient_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {shipment.recipient_city}, {shipment.recipient_state} •{" "}
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge className={getStatusColor(shipment.status)}>
                        {formatStatus(shipment.status)}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${shipment.total_cost.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{formatStatus(shipment.service_type)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2" />
              <p>No shipments found</p>
              {searchTerm || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="mt-4">
                  Clear Filters
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="w-full md:min-w-4xl">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
          </DialogHeader>

          {selectedShipment && (
            <div className="w-full max-h-[80vh] overflow-y-auto">
              <ShipmentDetailView shipmentId={selectedShipment.id} />
            </div>
          )}

          <div className="flex flex-wrap space-y-4 space-x-4">
            <Button
              variant="outline"
              size="sm"
              title="update shipment"
              className="p-1 w-max float-right bg-transparent hover:bg-green-200 border-green-300 text-green-700"
              onClick={() => {
                setEditDialogOpen(true);
                setSelectedShipment(selectedShipment2);
              }}>
              <Edit className="h-4 w-4" />
              Update Shipment
            </Button>

            <Button
              variant="outline"
              size="sm"
              title="update tracking event"
              onClick={async () => {
                setSelectedShipment(selectedShipment);
                setNewStatus(selectedShipment?.status!);
                setUpdateDialogOpen(true);
                setError(null);

                // 🪄 Fetch default payment data for this shipment
                const payments = await fetchLatestPaymentForShipment(selectedShipment?.id!);
                if (payments) {
                  setPaymentMethods(payments.payment_method || []);
                  setPaymentAmount(payments.amount || null);
                } else {
                  setPaymentMethods([]);
                  setPaymentAmount(null);
                }
              }}
              className="p-1 w-max float-right bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
              aria-label="Update">
              <Edit className="h-4 w-4" />
              Update Event
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="delete shipment"
              className="p-1 w-max bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
              onClick={() => {
                setDeleteDialogOpen(true);
                setSelectedShipment(selectedShipment);
              }}>
              <Delete className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update shipment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>

          {selectedShipment2 && <ShipmentEditPage shipmentId={selectedShipment2.id} />}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment Event Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="exception">Exception</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mt-3 rounded mx-auto text-center">
                  {error}
                </div>
              )}
            </div>
            {(newStatus === "exception" || newStatus === "cancelled") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Payment Methods</Label>
                  <div className="flex flex-wrap gap-2">
                    {paymentOptions.map((option) => (
                      <label
                        key={option.type}
                        className="flex items-center flex-wrap space-y-2 space-x-2 border rounded-md px-2 py-1 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          value={option.type}
                          checked={paymentMethods.includes(option.type)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPaymentMethods((prev) =>
                              prev.includes(value)
                                ? prev.filter((v) => v !== value)
                                : [...prev, value]
                            );
                          }}
                          className="accent-red-600"
                        />
                        <span>{option.type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    placeholder="Enter amount"
                    type="number"
                    value={paymentAmount ?? ""}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                className="bg-red-600 hover:bg-red-700 text-white">
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* delete shipment Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shipment & Events</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <DialogDescription>
              Are you sure you want to delete this shipment and it&apos;s tracking events? This
              action cannot be undone.
            </DialogDescription>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteShipment}
                className="bg-red-600 hover:bg-red-700 text-white">
                Delete Shipment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
