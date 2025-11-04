import { ShipmentsTable } from "@/components/dashboard/shipments-table";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ShipmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
        <p className="text-gray-600">Manage and track all your shipments</p>
      </div>

      <ShipmentsTable userId={user.id} />
    </div>
  );
}
