"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface AdminSettingsFormProps {
  adminProfile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export function AdminSettingsForm({ adminProfile }: AdminSettingsFormProps) {
  const [fullName, setFullName] = useState(adminProfile.full_name || "");
  const [phone, setPhone] = useState(adminProfile.phone || "");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
        })
        .eq("id", adminProfile.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={adminProfile.email || ""} disabled />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Future: System Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Coming soon: Manage pricing rules, service types, and automation
            preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
