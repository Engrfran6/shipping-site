"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Calculator, Package } from "lucide-react";
import { useState } from "react";

interface QuoteFormData {
  // Contact info
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Origin
  originAddress: string;
  originCity: string;
  originState: string;
  originPostalCode: string;

  // Destination
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationPostalCode: string;

  // Package details
  packageType: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  declaredValue: string;

  // Service options
  serviceType: string;
  signatureRequired: boolean;
  insuranceRequired: boolean;
}

export function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    originAddress: "",
    originCity: "",
    originState: "",
    originPostalCode: "",
    destinationAddress: "",
    destinationCity: "",
    destinationState: "",
    destinationPostalCode: "",
    packageType: "",
    weightKg: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    declaredValue: "0",
    serviceType: "",
    signatureRequired: false,
    insuranceRequired: false,
  });

  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (
    field: keyof QuoteFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // First, calculate the shipping cost
      const { data: costData, error: costError } = await supabase.rpc(
        "calculate_shipping_cost",
        {
          p_service_type: formData.serviceType,
          p_weight_kg: Number.parseFloat(formData.weightKg),
          p_length_cm: formData.lengthCm
            ? Number.parseFloat(formData.lengthCm)
            : null,
          p_width_cm: formData.widthCm
            ? Number.parseFloat(formData.widthCm)
            : null,
          p_height_cm: formData.heightCm
            ? Number.parseFloat(formData.heightCm)
            : null,
          p_declared_value: Number.parseFloat(formData.declaredValue),
          p_signature_required: formData.signatureRequired,
          p_insurance_required: formData.insuranceRequired,
        }
      );

      if (costError) throw costError;

      // Save the quote to database
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          origin_address: formData.originAddress,
          origin_city: formData.originCity,
          origin_state: formData.originState,
          origin_postal_code: formData.originPostalCode,
          destination_address: formData.destinationAddress,
          destination_city: formData.destinationCity,
          destination_state: formData.destinationState,
          destination_postal_code: formData.destinationPostalCode,
          package_type: formData.packageType,
          weight_kg: Number.parseFloat(formData.weightKg),
          length_cm: formData.lengthCm
            ? Number.parseFloat(formData.lengthCm)
            : null,
          width_cm: formData.widthCm
            ? Number.parseFloat(formData.widthCm)
            : null,
          height_cm: formData.heightCm
            ? Number.parseFloat(formData.heightCm)
            : null,
          declared_value: Number.parseFloat(formData.declaredValue),
          service_type: formData.serviceType,
          signature_required: formData.signatureRequired,
          insurance_required: formData.insuranceRequired,
          estimated_cost: costData.total_cost,
          estimated_delivery_days: costData.estimated_delivery_days,
          status: "quoted",
          quote_expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days from now
        })
        .select()
        .maybeSingle();

      if (quoteError) throw quoteError;

      setQuote({ ...costData, quoteId: quoteData.id });
    } catch (error: any) {
      setError(error.message || "Failed to generate quote");
    } finally {
      setIsLoading(false);
    }
  };

  if (quote) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Calculator className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Your Shipping Quote
          </CardTitle>
          <CardDescription>Quote ID: {quote.quoteId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Base Cost:</span>
              <span className="font-medium">${quote.base_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Weight Cost:</span>
              <span className="font-medium">
                ${quote.weight_cost.toFixed(2)}
              </span>
            </div>
            {quote.insurance_cost > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Insurance:</span>
                <span className="font-medium">
                  ${quote.insurance_cost.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost:</span>
                <span className="text-blue-600">
                  ${quote.total_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-600">
            <p>
              Estimated Delivery: {quote.estimated_delivery_days} business days
            </p>
            <p className="text-sm mt-2">Quote valid for 7 days</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setQuote(null)}
              variant="outline"
              className="flex-1"
            >
              Get New Quote
            </Button>
            <Button
              asChild
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a href="/auth/signup">Create Account to Ship</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl text-gray-900">
          Get Instant Quote
        </CardTitle>
        <CardDescription>
          Enter your shipping details for an accurate price estimate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Full Name</Label>
                <Input
                  id="contactName"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    updateFormData("contactName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) =>
                    updateFormData("contactEmail", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => updateFormData("contactPhone", e.target.value)}
              />
            </div>
          </div>

          {/* Origin Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ship From</h3>
            <div>
              <Label htmlFor="originAddress">Address</Label>
              <Input
                id="originAddress"
                required
                value={formData.originAddress}
                onChange={(e) =>
                  updateFormData("originAddress", e.target.value)
                }
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="originCity">City</Label>
                <Input
                  id="originCity"
                  required
                  value={formData.originCity}
                  onChange={(e) => updateFormData("originCity", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="originState">State</Label>
                <Input
                  id="originState"
                  required
                  value={formData.originState}
                  onChange={(e) =>
                    updateFormData("originState", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="originPostalCode">ZIP Code</Label>
                <Input
                  id="originPostalCode"
                  required
                  value={formData.originPostalCode}
                  onChange={(e) =>
                    updateFormData("originPostalCode", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Destination Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ship To</h3>
            <div>
              <Label htmlFor="destinationAddress">Address</Label>
              <Input
                id="destinationAddress"
                required
                value={formData.destinationAddress}
                onChange={(e) =>
                  updateFormData("destinationAddress", e.target.value)
                }
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="destinationCity">City</Label>
                <Input
                  id="destinationCity"
                  required
                  value={formData.destinationCity}
                  onChange={(e) =>
                    updateFormData("destinationCity", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="destinationState">State</Label>
                <Input
                  id="destinationState"
                  required
                  value={formData.destinationState}
                  onChange={(e) =>
                    updateFormData("destinationState", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="destinationPostalCode">ZIP Code</Label>
                <Input
                  id="destinationPostalCode"
                  required
                  value={formData.destinationPostalCode}
                  onChange={(e) =>
                    updateFormData("destinationPostalCode", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Package Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageType">Package Type</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) =>
                    updateFormData("packageType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package type" />
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
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  required
                  value={formData.weightKg}
                  onChange={(e) => updateFormData("weightKg", e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lengthCm">Length (cm)</Label>
                <Input
                  id="lengthCm"
                  type="number"
                  step="0.1"
                  value={formData.lengthCm}
                  onChange={(e) => updateFormData("lengthCm", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="widthCm">Width (cm)</Label>
                <Input
                  id="widthCm"
                  type="number"
                  step="0.1"
                  value={formData.widthCm}
                  onChange={(e) => updateFormData("widthCm", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heightCm">Height (cm)</Label>
                <Input
                  id="heightCm"
                  type="number"
                  step="0.1"
                  value={formData.heightCm}
                  onChange={(e) => updateFormData("heightCm", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="declaredValue">Declared Value ($)</Label>
              <Input
                id="declaredValue"
                type="number"
                step="0.01"
                value={formData.declaredValue}
                onChange={(e) =>
                  updateFormData("declaredValue", e.target.value)
                }
              />
            </div>
          </div>

          {/* Service Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Service Options
            </h3>
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => updateFormData("serviceType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                  <SelectItem value="express">Express (2-3 days)</SelectItem>
                  <SelectItem value="overnight">Overnight (1 day)</SelectItem>
                  <SelectItem value="international">
                    International (7-14 days)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="signatureRequired"
                checked={formData.signatureRequired}
                onCheckedChange={(checked) =>
                  updateFormData("signatureRequired", checked as boolean)
                }
              />
              <Label htmlFor="signatureRequired">Signature Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="insuranceRequired"
                checked={formData.insuranceRequired}
                onCheckedChange={(checked) =>
                  updateFormData("insuranceRequired", checked as boolean)
                }
              />
              <Label htmlFor="insuranceRequired">Insurance Required</Label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Get Quote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
