import { AdminShipmentsTable } from "@/components/admin/admin-shipments-table";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminShipmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profiles || profiles.user_type !== "admin") {
    redirect("/auth/error?error=insufficient_permissions");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Shipments</h1>
        <p className="text-gray-600">
          Manage and track all shipments across the platform
        </p>
      </div>

      <AdminShipmentsTable />
    </div>
  );
}
