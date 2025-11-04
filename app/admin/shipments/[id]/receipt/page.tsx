import { ReceiptGenerator } from "@/components/admin/invoice-generator";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ReceiptPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile || profile.user_type !== "admin") {
    redirect("/auth/error?error=insufficient_permissions");
  }

  // Fetch shipment details
  const { data: shipment, error } = await supabase
    .from("shipments")
    .select(
      `
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        phone,
        company_name
      ),
      tracking_events (
        id,
        event_type,
        event_description,
        location,
        created_at
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !shipment) {
    redirect("/admin/shipments");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shipment Receipt</h1>
        <p className="text-gray-600 mt-2">
          Tracking: {shipment.tracking_number}
        </p>
      </div>

      <ReceiptGenerator shipment={shipment} />
    </div>
  );
}
