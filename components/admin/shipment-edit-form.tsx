"use client";

import type React from "react";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {createClient} from "@/lib/supabase/client";
import {AlertCircle, CheckCircle, Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_email?: string;
  sender_phone?: string;
  sender_address: string;
  sender_city: string;
  sender_state: string;
  sender_postal_code: string;
  sender_country: string;
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_postal_code: string;
  recipient_country: string;
  package_type: string;
  weight_kg: number;
  // length_cm?: number;
  // width_cm?: number;
  // height_cm?: number;
  declared_value: number;
  description?: string;
  service_type: string;
  delivery_instructions?: string;
  signature_required: boolean;
  insurance_required: boolean;
  base_cost: number;
  tax_amount: number;
  total_cost: number;
  // status: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
}

export function ShipmentEditForm({shipment: initialShipment}: {shipment: Shipment}) {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shipment, setShipment] = useState(initialShipment);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setShipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setShipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setShipment((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setShipment((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const {error: updateError} = await supabase
        .from("shipments")
        .update({
          sender_name: shipment.sender_name,
          sender_email: shipment.sender_email,
          sender_phone: shipment.sender_phone,
          sender_address: shipment.sender_address,
          sender_city: shipment.sender_city,
          sender_state: shipment.sender_state,
          sender_postal_code: shipment.sender_postal_code,
          sender_country: shipment.sender_country,
          recipient_name: shipment.recipient_name,
          recipient_email: shipment.recipient_email,
          recipient_phone: shipment.recipient_phone,
          recipient_address: shipment.recipient_address,
          recipient_city: shipment.recipient_city,
          recipient_state: shipment.recipient_state,
          recipient_postal_code: shipment.recipient_postal_code,
          recipient_country: shipment.recipient_country,
          package_type: shipment.package_type,
          weight_kg: shipment.weight_kg,
          // length_cm: shipment.length_cm,
          // width_cm: shipment.width_cm,
          // height_cm: shipment.height_cm,
          base_cost: shipment.base_cost,
          tax_amount: shipment.tax_amount,
          total_cost: shipment.tax_amount + shipment.base_cost,
          declared_value: shipment.declared_value,
          description: shipment.description,
          service_type: shipment.service_type,
          delivery_instructions: shipment.delivery_instructions,
          signature_required: shipment.signature_required,
          insurance_required: shipment.insurance_required,
          estimated_delivery_date: shipment.estimated_delivery_date,
          actual_delivery_date: shipment.actual_delivery_date,
        })
        .eq("id", shipment.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/shipments`);
      }, 1000);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh]">
      <div className="space-y-6 mb-3">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800">Shipment updated successfully. Redirecting...</p>
          </div>
        )}
      </div>

      <div className="overflow-y-auto max-h-[70vh] space-y-6">
        {/* Sender Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sender Information</CardTitle>
            <CardDescription>Update sender details for this shipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sender_name">Sender Name</Label>
                <Input
                  id="sender_name"
                  name="sender_name"
                  value={shipment.sender_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sender_email">Sender Email</Label>
                <Input
                  id="sender_email"
                  name="sender_email"
                  type="email"
                  value={shipment.sender_email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="sender_phone">Sender Phone</Label>
                <Input
                  id="sender_phone"
                  name="sender_phone"
                  value={shipment.sender_phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="sender_address">Address</Label>
                <Input
                  id="sender_address"
                  name="sender_address"
                  value={shipment.sender_address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sender_city">City</Label>
                <Input
                  id="sender_city"
                  name="sender_city"
                  value={shipment.sender_city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sender_state">State</Label>
                <Input
                  id="sender_state"
                  name="sender_state"
                  value={shipment.sender_state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sender_postal_code">Postal Code</Label>
                <Input
                  id="sender_postal_code"
                  name="sender_postal_code"
                  value={shipment.sender_postal_code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sender_country">Country</Label>
                <Input
                  id="sender_country"
                  name="sender_country"
                  value={shipment.sender_country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipient Information */}
        <Card>
          <CardHeader>
            <CardTitle>Recipient Information</CardTitle>
            <CardDescription>Update recipient details for this shipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient_name">Recipient Name</Label>
                <Input
                  id="recipient_name"
                  name="recipient_name"
                  value={shipment.recipient_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipient_email">Recipient Email</Label>
                <Input
                  id="recipient_email"
                  name="recipient_email"
                  type="email"
                  value={shipment.recipient_email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="recipient_phone">Recipient Phone</Label>
                <Input
                  id="recipient_phone"
                  name="recipient_phone"
                  value={shipment.recipient_phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="recipient_address">Address</Label>
                <Input
                  id="recipient_address"
                  name="recipient_address"
                  value={shipment.recipient_address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipient_city">City</Label>
                <Input
                  id="recipient_city"
                  name="recipient_city"
                  value={shipment.recipient_city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipient_state">State</Label>
                <Input
                  id="recipient_state"
                  name="recipient_state"
                  value={shipment.recipient_state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipient_postal_code">Postal Code</Label>
                <Input
                  id="recipient_postal_code"
                  name="recipient_postal_code"
                  value={shipment.recipient_postal_code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipient_country">Country</Label>
                <Input
                  id="recipient_country"
                  name="recipient_country"
                  value={shipment.recipient_country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Information */}
        <Card>
          <CardHeader>
            <CardTitle>Package Information</CardTitle>
            <CardDescription>Update package details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="package_type">Package Type</Label>
                <Select
                  value={shipment.package_type}
                  onValueChange={(value) => handleSelectChange("package_type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="envelope">Envelope</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="tube">Tube</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight_kg">Weight (kg)</Label>
                <Input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  step="0.01"
                  value={shipment.weight_kg}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              {/* <div>
                <Label htmlFor="length_cm">Length (cm)</Label>
                <Input
                  id="length_cm"
                  name="length_cm"
                  type="number"
                  step="0.1"
                  value={shipment.length_cm || ""}
                  onChange={handleNumberChange}
                />
              </div>
              <div>
                <Label htmlFor="width_cm">Width (cm)</Label>
                <Input
                  id="width_cm"
                  name="width_cm"
                  type="number"
                  step="0.1"
                  value={shipment.width_cm || ""}
                  onChange={handleNumberChange}
                />
              </div>
              <div>
                <Label htmlFor="height_cm">Height (cm)</Label>
                <Input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  step="0.1"
                  value={shipment.height_cm || ""}
                  onChange={handleNumberChange}
                />
              </div> */}
              <div>
                <Label htmlFor="declared_value">Declared Value ($)</Label>
                <Input
                  id="declared_value"
                  name="declared_value"
                  type="number"
                  step="0.01"
                  value={shipment.declared_value}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="flex gap-3">
                <div>
                  <Label htmlFor="tax_amount">Tax ($)</Label>
                  <Input
                    id="tax_amount"
                    name="tax_amount"
                    type="number"
                    value={shipment.tax_amount}
                    onChange={handleNumberChange}
                    required
                    className="text-green-600"
                  />
                </div>
                <div>
                  <Label htmlFor="base_cost">Fee ($)</Label>
                  <Input
                    id="base_cost"
                    name="base_cost"
                    type="number"
                    value={shipment.base_cost}
                    onChange={handleNumberChange}
                    required
                    className="text-green-600"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={shipment.description || ""}
                  onChange={handleInputChange}
                  placeholder="Item description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>Update service options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <Select
                  value={shipment.service_type}
                  onValueChange={(value) => handleSelectChange("service_type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={shipment.status}
                  onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              </div> */}
              <div>
                <Label htmlFor="estimated_delivery_date">Estimated Delivery Date</Label>
                <Input
                  id="estimated_delivery_date"
                  name="estimated_delivery_date"
                  type="date"
                  value={
                    new Date(shipment.estimated_delivery_date!).toISOString().split("T")[0] || ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="actual_delivery_date">Actual Delivery Date</Label>
                <Input
                  id="actual_delivery_date"
                  name="actual_delivery_date"
                  type="date"
                  value={new Date(shipment.actual_delivery_date!).toISOString().split("T")[0] || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="delivery_instructions">Delivery Instructions</Label>
                <Input
                  id="delivery_instructions"
                  name="delivery_instructions"
                  value={shipment.delivery_instructions || ""}
                  onChange={handleInputChange}
                  placeholder="Special delivery instructions"
                />
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="signature_required"
                  checked={shipment.signature_required}
                  onChange={(e) => handleCheckboxChange("signature_required", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="signature_required" className="cursor-pointer">
                  Signature Required
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="insurance_required"
                  checked={shipment.insurance_required}
                  onChange={(e) => handleCheckboxChange("insurance_required", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="insurance_required" className="cursor-pointer">
                  Insurance Required
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end pt-6">
        {/* <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button> */}
        <Button
          type="submit"
          disabled={isLoading}
          size="sm"
          className="bg-blue-800 text-white hover:bg-blue-500 hover:text-white">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
