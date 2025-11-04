"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface PaymentOption {
  id?: string;
  type: string;
  label: string;
  account?: string;
  bank?: string;
  email?: string;
  note?: string;
  routing_number?: string;
  swift_code?: string;
  bank_address?: string;
}

const paymentTypeOptions = [
  { value: "paypal", label: "PayPal" },
  { value: "zelle", label: "Zelle" },
  { value: "domestic_transfer", label: "Domestic Bank Transfer (USA)" },
  {
    value: "international_transfer",
    label: "International Wire Transfer (SWIFT)",
  },
  { value: "venmo", label: "Venmo" },
  { value: "cashapp", label: "Cash App" },
  { value: "crypto", label: "USDT (TRC20)" },
];

// Map what fields each payment type uses
const fieldMap: Record<string, string[]> = {
  paypal: ["email", "note"],
  zelle: ["email", "note"],
  domestic_transfer: [
    "bank",
    "account",
    "routing_number",
    "bank_address",
    "note",
  ],
  international_transfer: [
    "bank",
    "account",
    "swift_code",
    "bank_address",
    "note",
  ],
  venmo: ["account", "note"],
  cashapp: ["account", "note"],
  crypto: ["account", "note"],
};

export default function AdminPaymentOptions() {
  const supabase = createClient();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [form, setForm] = useState<PaymentOption>({
    type: "",
    label: "",
    account: "",
    bank: "",
    email: "",
    note: "",
    routing_number: "",
    swift_code: "",
    bank_address: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchPaymentOptions = async () => {
    const { data, error } = await supabase
      .from("payment_options")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setPaymentOptions(data);
  };

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    const selected = paymentTypeOptions.find((opt) => opt.value === value);
    setForm({
      ...form,
      type: selected?.value || "",
      label: selected?.label || "",
      account: "",
      bank: "",
      email: "",
      note: "",
      routing_number: "",
      swift_code: "",
      bank_address: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.label) {
      alert("Please select a payment type.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("payment_options").insert([form]);
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Payment option added!");
      setForm({
        type: "",
        label: "",
        account: "",
        bank: "",
        email: "",
        note: "",
        routing_number: "",
        swift_code: "",
        bank_address: "",
      });
      fetchPaymentOptions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this option?")) return;
    const { error } = await supabase
      .from("payment_options")
      .delete()
      .eq("id", id);
    if (error) alert(error.message);
    else fetchPaymentOptions();
  };

  const visibleFields = form.type ? fieldMap[form.type] || [] : [];

  // Dynamic label + placeholder for account field
  const getAccountLabel = (type: string) => {
    switch (type) {
      case "venmo":
        return { label: "Venmo Tag / Handle", placeholder: "@YourVenmoName" };
      case "cashapp":
        return { label: "Cash App Tag", placeholder: "$YourCashTag" };
      case "crypto":
        return {
          label: "Wallet Address",
          placeholder: "USDT (TRC20) Wallet Address",
        };
      case "domestic_transfer":
      case "international_transfer":
        return { label: "Account Number", placeholder: "e.g. 123456789" };
      default:
        return {
          label: "Account / Handle",
          placeholder: "Enter account or tag",
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10">
      {/* Add Payment Option */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Add Payment Option
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Type */}
            <div>
              <Label>Payment Type</Label>
              <Select value={form.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.label && (
              <div>
                <Label>Label</Label>
                <Input name="label" value={form.label} readOnly />
              </div>
            )}

            {/* Conditional Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Email field */}
              {visibleFields.includes("email") && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>
                    {form.type === "paypal"
                      ? "PayPal Email / Tag"
                      : "Email Address"}
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder={
                      form.type === "paypal"
                        ? "e.g. payments@globalship.com or @PayPalTag"
                        : "e.g. finance@globalship.com"
                    }
                    value={form.email || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {visibleFields.includes("bank") && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>Bank Name</Label>
                  <Input
                    name="bank"
                    placeholder="e.g. Citibank International"
                    value={form.bank || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Dynamic account field */}
              {visibleFields.includes("account") && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>{getAccountLabel(form.type).label}</Label>
                  <Input
                    name="account"
                    placeholder={getAccountLabel(form.type).placeholder}
                    value={form.account || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {visibleFields.includes("routing_number") && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>Routing Number</Label>
                  <Input
                    name="routing_number"
                    placeholder="e.g. 021000021"
                    value={form.routing_number || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {visibleFields.includes("swift_code") && (
                <div className="col-span-2 sm:col-span-1">
                  <Label>SWIFT Code</Label>
                  <Input
                    name="swift_code"
                    placeholder="e.g. CITIUS33"
                    value={form.swift_code || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {visibleFields.includes("bank_address") && (
                <div className="col-span-2">
                  <Label>Bank Address (Optional)</Label>
                  <Input
                    name="bank_address"
                    placeholder="e.g. 123 Main St, New York, NY"
                    value={form.bank_address || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {visibleFields.includes("note") && (
              <div>
                <Label>Note</Label>
                <Textarea
                  name="note"
                  placeholder="Any special payment instructions..."
                  value={form.note || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading || !form.type}
            >
              {loading ? "Saving..." : "Add Payment Option"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Existing Payment Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentOptions.length === 0 ? (
            <p className="text-gray-500">No payment options added yet.</p>
          ) : (
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  className="border rounded-md p-4 flex justify-between items-start bg-gray-50"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600">{option.type}</p>

                    {option.bank && (
                      <p className="text-sm text-gray-700">
                        <strong>Bank:</strong> {option.bank}
                      </p>
                    )}
                    {option.account && (
                      <p className="text-sm text-gray-700">
                        <strong>
                          {option.type === "crypto"
                            ? "Wallet"
                            : "Account / Handle"}
                          :
                        </strong>{" "}
                        {option.account}
                      </p>
                    )}
                    {option.routing_number && (
                      <p className="text-sm text-gray-700">
                        <strong>Routing Number:</strong> {option.routing_number}
                      </p>
                    )}
                    {option.swift_code && (
                      <p className="text-sm text-gray-700">
                        <strong>SWIFT:</strong> {option.swift_code}
                      </p>
                    )}
                    {option.bank_address && (
                      <p className="text-sm text-gray-700">
                        <strong>Bank Address:</strong> {option.bank_address}
                      </p>
                    )}
                    {option.email && (
                      <p className="text-sm text-gray-700">
                        <strong>Email:</strong> {option.email}
                      </p>
                    )}
                    {option.note && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        {option.note}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(option.id!)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
