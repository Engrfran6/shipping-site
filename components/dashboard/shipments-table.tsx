"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Shipment } from "@/lib/types/database";
import { Eye, Package, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ShipmentsTableProps {
  userId: string;
}

export function ShipmentsTable({ userId }: ShipmentsTableProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log("userId=====>", userId);
  console.log("shipments=====>", shipments);

  useEffect(() => {
    fetchShipments();
  }, [userId]);

  useEffect(() => {
    filterShipments();
  }, [shipments, searchTerm, statusFilter]);

  const fetchShipments = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.tracking_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.recipient_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.recipient_city
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (shipment) => shipment.status === statusFilter
      );
    }

    setFilteredShipments(filtered);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Shipments</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by tracking number, recipient, or city..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="exception">Exception</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredShipments.length > 0 ? (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{shipment.tracking_number}</p>
                      <p className="text-sm text-gray-600">
                        {shipment.sender_city}, {shipment.sender_state} →{" "}
                        {shipment.recipient_city}, {shipment.recipient_state}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(shipment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(shipment.status)}>
                        {formatStatus(shipment.status)}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        ${shipment.total_cost.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatStatus(shipment.service_type)}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/shipments/${shipment.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
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
                className="mt-4"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                asChild
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/dashboard/create">Create Your First Shipment</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
