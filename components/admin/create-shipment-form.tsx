"use client";

import type React from "react";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
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
import type {Profile} from "@/lib/types/database";
import {ArrowRight, Package} from "lucide-react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

interface CreateShipmentFormProps {
  profiles: Profile[] | null;
}

interface ShipmentFormData {
  // Sender info (pre-filled from profiles)
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderCountry: string;
  senderPostalCode: string;

  // Recipient info
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientCountry: string;
  recipientPostalCode: string;

  // Package details
  packageType: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  declaredValue: string;
  description: string;

  // Service options
  serviceType: string;
  deliveryInstructions: string;
  signatureRequired: boolean;
  insuranceRequired: boolean;
}

export function CreateShipmentForm({profiles}: CreateShipmentFormProps) {
  const [user, setUser] = useState<Profile | null>(null);

  const router = useRouter();
  const [formData, setFormData] = useState<ShipmentFormData>({
    senderName: user?.full_name || "",
    senderEmail: user?.email || "",
    senderPhone: user?.phone || "",
    senderAddress: user?.address || "",
    senderCity: user?.city || "",
    senderState: user?.state || "",
    senderCountry: user?.country || "",
    senderPostalCode: user?.postal_code || "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: "",
    recipientCity: "",
    recipientState: "",
    recipientCountry: "",
    recipientPostalCode: "",
    packageType: "",
    weightKg: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    declaredValue: "0",
    description: "",
    serviceType: "",
    deliveryInstructions: "",
    signatureRequired: false,
    insuranceRequired: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const updateFormData = (field: keyof ShipmentFormData, value: string | boolean) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // First, calculate the shipping cost
      const {data: costData, error: costError} = await supabase.rpc("calculate_shipping_cost", {
        p_service_type: formData.serviceType.toLowerCase(),
        p_weight_kg: Number.parseFloat(formData.weightKg) || 0,
        p_length_cm: formData.lengthCm ? Number.parseFloat(formData.lengthCm) : null,
        p_width_cm: formData.widthCm ? Number.parseFloat(formData.widthCm) : null,
        p_height_cm: formData.heightCm ? Number.parseFloat(formData.heightCm) : null,
        p_declared_value: Number.parseFloat(formData.declaredValue),
        p_signature_required: formData.signatureRequired,
        p_insurance_required: formData.insuranceRequired,
      });

      if (costError) throw costError;

      // Generate tracking number
      const {data: trackingData, error: trackingError} = await supabase.rpc(
        "generate_tracking_number"
      );

      if (trackingError) throw trackingError;

      // Create the shipment
      const {data: shipmentData, error: shipmentError} = await supabase
        .from("shipments")
        .insert({
          tracking_number: trackingData,
          user_id: user?.id ?? null,
          sender_name: formData.senderName,
          sender_email: formData.senderEmail,
          sender_phone: formData.senderPhone,
          sender_address: formData.senderAddress,
          sender_city: formData.senderCity,
          sender_state: formData.senderState,
          sender_postal_code: formData.senderPostalCode,
          sender_country: formData.senderCountry,
          recipient_name: formData.recipientName,
          recipient_email: formData.recipientEmail,
          recipient_phone: formData.recipientPhone,
          recipient_address: formData.recipientAddress,
          recipient_city: formData.recipientCity,
          recipient_state: formData.recipientState,
          recipient_postal_code: formData.recipientPostalCode,
          recipient_country: formData.recipientCountry,
          package_type: formData.packageType,
          weight_kg: Number.parseFloat(formData.weightKg),
          length_cm: formData.lengthCm ? Number.parseFloat(formData.lengthCm) : null,
          width_cm: formData.widthCm ? Number.parseFloat(formData.widthCm) : null,
          height_cm: formData.heightCm ? Number.parseFloat(formData.heightCm) : null,
          declared_value: Number.parseFloat(formData.declaredValue),
          description: formData.description,
          service_type: formData.serviceType,
          delivery_instructions: formData.deliveryInstructions,
          signature_required: formData.signatureRequired,
          insurance_required: formData.insuranceRequired,
          status: "created",
          base_cost: costData.base_cost,
          insurance_cost: costData.insurance_cost,
          total_cost: costData.total_cost,
          // estimated_delivery_date: new Date(
          //   Date.now() + costData.estimated_delivery_days * 24 * 60 * 60 * 1000
          // ).toISOString(),
          estimated_delivery_date: new Date(
            Date.now() + Number(costData?.estimated_delivery_days) || 0 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .select()
        .maybeSingle();

      if (shipmentError) throw shipmentError;

      // // Create initial tracking event with event_description auto-filled in the database
      // const { error: eventError } = await supabase.rpc(
      //   "create_tracking_event",
      //   {
      //     p_shipment_id: shipmentData.id,
      //     p_event_type: "created",
      //     p_location: `${formData.senderCity}, ${formData.senderState}`,
      //   }
      // );

      // if (eventError) throw eventError;

      if (shipmentData) {
        router.push("/admin/shipments");
      }
    } catch (error: any) {
      setError("Failed to create shipment");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.full_name || "",
        senderEmail: user.email || "",
        senderPhone: user.phone || "",
        senderAddress: user.address || "",
        senderCity: user.city || "",
        senderState: user.state || "",
        senderPostalCode: user.postal_code || "",
      }));
    }
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className={`flex items-center ${stepNumber < 3 ? "flex-1" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {step} of 3:{" "}
            {step === 1 ? "Addresses" : step === 2 ? "Package Details" : "Service Options"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Addresses</CardTitle>
              <CardDescription>Enter sender and recipient information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sender Information */}
              <div className="overflow-y-auto max-h-[40vh]">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sender Information</h3>

                  {(profiles?.length ?? 0) > 0 && (
                    <div>
                      <Label htmlFor="user">Select user</Label>

                      <Select
                        value={user?.id}
                        onValueChange={(value) =>
                          setUser(profiles?.find((u) => u.id === value) || null)
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>

                        <SelectContent>
                          {profiles?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || user.email || "Unknown User"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senderName">Full Name</Label>
                      <Input
                        id="senderName"
                        required
                        value={formData.senderName}
                        onChange={(e) => updateFormData("senderName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderEmail">Email</Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        value={formData.senderEmail}
                        placeholder="optional"
                        onChange={(e) => updateFormData("senderEmail", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="senderPhone">Phone Number</Label>
                    <Input
                      id="senderPhone"
                      type="tel"
                      required
                      value={formData.senderPhone}
                      onChange={(e) => updateFormData("senderPhone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderAddress">Address</Label>
                    <Input
                      id="senderAddress"
                      placeholder="optional"
                      value={formData.senderAddress}
                      onChange={(e) => updateFormData("senderAddress", e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="senderCity">City</Label>
                      <Input
                        id="senderCity"
                        placeholder="optional"
                        value={formData.senderCity}
                        onChange={(e) => updateFormData("senderCity", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderState">State</Label>
                      <Input
                        id="senderState"
                        required
                        value={formData.senderState}
                        onChange={(e) => updateFormData("senderState", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderCountry">Country</Label>
                      <Input
                        id="senderState"
                        required
                        value={formData.senderCountry}
                        onChange={(e) => updateFormData("senderCountry", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderPostalCode">ZIP Code</Label>
                      <Input
                        id="senderPostalCode"
                        placeholder="optional"
                        value={formData.senderPostalCode}
                        onChange={(e) => updateFormData("senderPostalCode", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recipient Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipientName">Full Name</Label>
                      <Input
                        id="recipientName"
                        required
                        value={formData.recipientName}
                        onChange={(e) => updateFormData("recipientName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail">Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => updateFormData("recipientEmail", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="recipientPhone">Phone Number</Label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      value={formData.recipientPhone}
                      onChange={(e) => updateFormData("recipientPhone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientAddress">Address</Label>
                    <Input
                      id="recipientAddress"
                      required
                      value={formData.recipientAddress}
                      onChange={(e) => updateFormData("recipientAddress", e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="recipientCity">City</Label>
                      <Input
                        id="recipientCity"
                        required
                        value={formData.recipientCity}
                        onChange={(e) => updateFormData("recipientCity", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientState">State</Label>
                      <Input
                        id="recipientState"
                        required
                        value={formData.recipientState}
                        onChange={(e) => updateFormData("recipientState", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientCountry">Country</Label>
                      <Input
                        id="recipientCountry"
                        required
                        value={formData.recipientCountry}
                        onChange={(e) => updateFormData("recipientCountry", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientPostalCode">ZIP Code</Label>
                      <Input
                        id="recipientPostalCode"
                        required
                        value={formData.recipientPostalCode}
                        onChange={(e) => updateFormData("recipientPostalCode", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={formData.recipientName === "" && formData.recipientEmail === ""}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
              <CardDescription>Describe your package for accurate pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-y-auto max-h-[40vh] space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="packageType">Package Type</Label>
                    <Select
                      value={formData.packageType}
                      onValueChange={(value) => updateFormData("packageType", value)}>
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

                {/* <div className="grid md:grid-cols-3 gap-4">
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
                </div> */}

                <div>
                  <Label htmlFor="declaredValue">Declared Value ($)</Label>
                  <Input
                    id="declaredValue"
                    type="number"
                    step="0.01"
                    value={formData.declaredValue}
                    onChange={(e) => updateFormData("declaredValue", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Package Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the contents of your package"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={formData.packageType === "" && formData.weightKg === ""}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Options</CardTitle>
              <CardDescription>Choose your shipping service and additional options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-y-auto max-h-[60vh] space-y-6">
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => updateFormData("serviceType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (5-7 days) - Most economical
                      </SelectItem>
                      <SelectItem value="express">Express (2-3 days) - Faster delivery</SelectItem>
                      <SelectItem value="overnight">
                        Overnight (1 day) - Next business day
                      </SelectItem>
                      <SelectItem value="international">
                        International (7-14 days) - Worldwide
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="deliveryInstructions"
                    placeholder="Special delivery instructions for the recipient"
                    value={formData.deliveryInstructions}
                    onChange={(e) => updateFormData("deliveryInstructions", e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signatureRequired"
                      checked={formData.signatureRequired}
                      onCheckedChange={(checked) =>
                        updateFormData("signatureRequired", checked as boolean)
                      }
                    />
                    <Label htmlFor="signatureRequired">Signature Required (+$2.50)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insuranceRequired"
                      checked={formData.insuranceRequired}
                      onCheckedChange={(checked) =>
                        updateFormData("insuranceRequired", checked as boolean)
                      }
                    />
                    <Label htmlFor="insuranceRequired">
                      Insurance Required (1% of declared value)
                    </Label>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Shipment...
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Create Shipment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

// "use client";

// import {yupResolver} from "@hookform/resolvers/yup";
// import {useRouter} from "next/navigation";
// import {useEffect, useState} from "react";
// import {FormProvider, useForm} from "react-hook-form";
// import * as yup from "yup";

// import {Button} from "@/components/ui/button";
// import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
// import {Input} from "@/components/ui/input";
// import {Label} from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {createClient} from "@/lib/supabase/client";
// import type {Profile} from "@/lib/types/database";

// import {ArrowRight, Package} from "lucide-react";

// // ✅ Validation schema
// const shipmentSchema = yup.object({
//   // Step 1 - Addresses
//   senderName: yup.string().required("Sender name is required"),
//   senderEmail: yup.string().optional(),
//   senderAddress: yup.string().optional(),
//   senderCity: yup.string().optional(),
//   senderPostalCode: yup.string().optional(),
//   senderPhone: yup
//     .string()
//     .matches(/^[0-9+\- ]+$/, "Invalid phone number")
//     .required("Sender phone is required"),
//   senderState: yup.string().required("Sender state is required"),
//   senderCountry: yup.string().required("Sender country is required"),

//   recipientEmail: yup.string().required("Recipient email is required"),
//   recipientPostalCode: yup.string().required("Recipient postal code is required"),
//   recipientPhone: yup.string().required("Recipient phone number is required"),
//   recipientName: yup.string().required("Recipient name is required"),
//   recipientAddress: yup.string().required("Recipient address is required"),
//   recipientCity: yup.string().required("Recipient city is required"),
//   recipientState: yup.string().required("Recipient state is required"),

//   recipientCountry: yup.string().required("Recipient country is required"),

//   description: yup.string().optional(),
//   deliveryInstructions: yup.string(),
//   signatureRequired: yup.boolean(),
//   insuranceRequired: yup.boolean(),

//   // Step 2 - Package
//   packageType: yup.string().required("Package type is required"),
//   weightKg: yup
//     .number()
//     .typeError("Weight must be a number")
//     .positive("Weight must be positive")
//     .required("Weight is required"),
//   declaredValue: yup
//     .number()
//     .typeError("Declared value must be a number")
//     .min(0, "Declared value cannot be negative")
//     .required("Declared value is required"),

//   // Step 3 - Service
//   serviceType: yup.string().required("Service type is required"),
// });

// type ShipmentFormData = yup.InferType<typeof shipmentSchema>;

// interface CreateShipmentFormProps {
//   profiles: Profile[] | null;
// }

// export function CreateShipmentForm({profiles}: CreateShipmentFormProps) {
//   const router = useRouter();
//   const [user, setUser] = useState<Profile | null>(null);
//   const [step, setStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const methods = useForm<ShipmentFormData>({
//     resolver: yupResolver(shipmentSchema),
//     defaultValues: {
//       senderName: "",
//       senderEmail: "",
//       senderPhone: "",
//       senderAddress: "",
//       senderCity: "",
//       senderState: "",
//       senderCountry: "",
//       senderPostalCode: "",
//       recipientName: "",
//       recipientEmail: "",
//       recipientPhone: "",
//       recipientAddress: "",
//       recipientCity: "",
//       recipientState: "",
//       recipientCountry: "",
//       recipientPostalCode: "",
//       packageType: "",
//       weightKg: 0,
//       declaredValue: 0,
//       description: "",
//       serviceType: "",
//       deliveryInstructions: "",
//       signatureRequired: false,
//       insuranceRequired: false,
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     trigger,
//     formState: {errors},
//   } = methods;

//   const formData = watch();

//   useEffect(() => {
//     if (user) {
//       setValue("senderName", user.full_name || "");
//       setValue("senderEmail", user.email || "");
//       setValue("senderPhone", user.phone || "");
//       setValue("senderAddress", user.address || "");
//       setValue("senderCity", user.city || "");
//       setValue("senderState", user.state || "");
//       setValue("senderCountry", user.country || "");
//       setValue("senderPostalCode", user.postal_code || "");
//     }
//   }, [user, setValue]);

//   const nextStep = async () => {
//     const stepFields =
//       step === 1
//         ? [
//             "senderName",
//             "senderPhone",
//             "senderState",
//             "senderCountry",
//             "recipientName",
//             "recipientAddress",
//             "recipientCity",
//             "recipientState",
//             "recipientCountry",
//           ]
//         : step === 2
//         ? ["packageType", "weightKg", "declaredValue"]
//         : ["serviceType"];

//     const valid = await trigger(stepFields as any);
//     if (valid) setStep((s) => s + 1);
//   };

//   const prevStep = () => setStep((s) => s - 1);

//   const onSubmit = async (data: ShipmentFormData) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const supabase = createClient();

//       const {data: costData, error: costError} = await supabase.rpc("calculate_shipping_cost", {
//         p_service_type: data.serviceType.toLowerCase(),
//         p_weight_kg: Number(data.weightKg),
//         p_declared_value: Number(data.declaredValue),
//         p_signature_required: data.signatureRequired,
//         p_insurance_required: data.insuranceRequired,
//       });

//       if (costError) throw costError;

//       const {data: trackingData, error: trackingError} = await supabase.rpc(
//         "generate_tracking_number"
//       );
//       if (trackingError) throw trackingError;

//       const {error: shipmentError} = await supabase.from("shipments").insert({
//         tracking_number: trackingData,
//         user_id: user?.id ?? null,
//         sender_name: data.senderName,
//         sender_email: data.senderEmail,
//         sender_phone: data.senderPhone,
//         sender_address: data.senderAddress,
//         sender_city: data.senderCity,
//         sender_state: data.senderState,
//         sender_postal_code: data.senderPostalCode,
//         sender_country: data.senderCountry,
//         recipient_name: data.recipientName,
//         recipient_email: data.recipientEmail,
//         recipient_phone: data.recipientPhone,
//         recipient_address: data.recipientAddress,
//         recipient_city: data.recipientCity,
//         recipient_state: data.recipientState,
//         recipient_postal_code: data.recipientPostalCode,
//         recipient_country: data.recipientCountry,
//         package_type: data.packageType,
//         weight_kg: Number(data.weightKg),
//         declared_value: Number(data.declaredValue),
//         description: data.description,
//         service_type: data.serviceType,
//         delivery_instructions: data.deliveryInstructions,
//         signature_required: data.signatureRequired,
//         insurance_required: data.insuranceRequired,
//         status: "created",
//         base_cost: costData.base_cost,
//         insurance_cost: costData.insurance_cost,
//         total_cost: costData.total_cost,
//         estimated_delivery_date: new Date(
//           Date.now() + Number(costData?.estimated_delivery_days || 0) * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       });

//       if (shipmentError) throw shipmentError;

//       router.push("/admin/shipments");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to create shipment");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Stepper */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           {[1, 2, 3].map((n) => (
//             <div key={n} className={`flex items-center ${n < 3 ? "flex-1" : ""}`}>
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                   step >= n ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
//                 }`}>
//                 {n}
//               </div>
//               {n < 3 && (
//                 <div className={`flex-1 h-1 mx-4 ${step > n ? "bg-blue-600" : "bg-gray-200"}`} />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="text-center text-sm text-gray-600">
//           Step {step} of 3:{" "}
//           {step === 1 ? "Addresses" : step === 2 ? "Package Details" : "Service Options"}
//         </div>
//       </div>

//       {/* Form */}
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* STEP 1 */}
//           {step === 1 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Shipping Addresses</CardTitle>
//                 <CardDescription>Enter sender and recipient information</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="overflow-y-auto max-h-[40vh] space-y-4">
//                   <h3 className="text-lg font-semibold">Sender Information</h3>

//                   {(profiles?.length ?? 0) > 0 && (
//                     <div>
//                       <Label htmlFor="user">Select user</Label>
//                       <Select
//                         value={user?.id}
//                         onValueChange={(value) =>
//                           setUser(profiles?.find((u) => u.id === value) || null)
//                         }>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a user" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {profiles?.map((u) => (
//                             <SelectItem key={u.id} value={u.id}>
//                               {u.full_name || u.email}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   )}

//                   <div>
//                     <Label>Full Name</Label>
//                     <Input {...register("senderName")} />
//                     {errors.senderName && (
//                       <p className="text-sm text-red-500">{errors.senderName.message}</p>
//                     )}
//                   </div>

//                   <div>
//                     <Label>Phone</Label>
//                     <Input {...register("senderPhone")} />
//                     {errors.senderPhone && (
//                       <p className="text-sm text-red-500">{errors.senderPhone.message}</p>
//                     )}
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label>State</Label>
//                       <Input {...register("senderState")} />
//                       {errors.senderState && (
//                         <p className="text-sm text-red-500">{errors.senderState.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label>Country</Label>
//                       <Input {...register("senderCountry")} />
//                       {errors.senderCountry && (
//                         <p className="text-sm text-red-500">{errors.senderCountry.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <h3 className="text-lg font-semibold">Recipient Information</h3>
//                   <div>
//                     <Label>Full Name</Label>
//                     <Input {...register("recipientName")} />
//                     {errors.recipientName && (
//                       <p className="text-sm text-red-500">{errors.recipientName.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <Label>Address</Label>
//                     <Input {...register("recipientAddress")} />
//                     {errors.recipientAddress && (
//                       <p className="text-sm text-red-500">{errors.recipientAddress.message}</p>
//                     )}
//                   </div>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div>
//                       <Label>City</Label>
//                       <Input {...register("recipientCity")} />
//                       {errors.recipientCity && (
//                         <p className="text-sm text-red-500">{errors.recipientCity.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label>State</Label>
//                       <Input {...register("recipientState")} />
//                       {errors.recipientState && (
//                         <p className="text-sm text-red-500">{errors.recipientState.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label>Country</Label>
//                       <Input {...register("recipientCountry")} />
//                       {errors.recipientCountry && (
//                         <p className="text-sm text-red-500">{errors.recipientCountry.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button type="button" onClick={nextStep}>
//                     Next Step <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Package Details</CardTitle>
//                 <CardDescription>Describe your package</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <Label>Package Type</Label>
//                   <Select
//                     value={formData.packageType}
//                     onValueChange={(v) => setValue("packageType", v)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select package type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="envelope">Envelope</SelectItem>
//                       <SelectItem value="box">Box</SelectItem>
//                       <SelectItem value="tube">Tube</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {errors.packageType && (
//                     <p className="text-sm text-red-500">{errors.packageType.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>Weight (kg)</Label>
//                   <Input type="number" step="0.1" {...register("weightKg")} />
//                   {errors.weightKg && (
//                     <p className="text-sm text-red-500">{errors.weightKg.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>Declared Value ($)</Label>
//                   <Input type="number" step="0.01" {...register("declaredValue")} />
//                   {errors.declaredValue && (
//                     <p className="text-sm text-red-500">{errors.declaredValue.message}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={prevStep} type="button">
//                     Previous
//                   </Button>
//                   <Button type="button" onClick={nextStep}>
//                     Next Step <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Service Options</CardTitle>
//                 <CardDescription>Choose your shipping service</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <Label>Service Type</Label>
//                   <Select
//                     value={formData.serviceType}
//                     onValueChange={(v) => setValue("serviceType", v)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select service" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="standard">Standard</SelectItem>
//                       <SelectItem value="express">Express</SelectItem>
//                       <SelectItem value="overnight">Overnight</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {errors.serviceType && (
//                     <p className="text-sm text-red-500">{errors.serviceType.message}</p>
//                   )}
//                 </div>

//                 {error && <div className="bg-red-50 text-red-700 p-2 rounded">{error}</div>}

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={prevStep} type="button">
//                     Previous
//                   </Button>
//                   <Button type="submit" disabled={isLoading}>
//                     {isLoading ? (
//                       "Creating..."
//                     ) : (
//                       <>
//                         <Package className="mr-2 h-4 w-4" />
//                         Create Shipment
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </form>
//       </FormProvider>
//     </div>
//   );
// }
