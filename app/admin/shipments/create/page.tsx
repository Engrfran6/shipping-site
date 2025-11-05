// app/dashboard/shipments/create/page.tsx
import {CreateShipmentForm} from "@/components/admin/create-shipment-form";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export default async function CreateShipmentPage() {
  const supabase = await createClient();

  // Get the logged-in user
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const {data: profile} = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.user_type !== "admin") {
    redirect("/auth/error?error=insufficient_permissions");
  }

  // Get all profiles (users)
  const {data: profiles} = await supabase
    .from("profiles")
    .select("*")
    .eq("user_type", "client")
    .order("full_name", {ascending: true});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="md:text-2xl font-semibold text-gray-900">Create New Shipment</h1>
        <p className="text-gray-600">Fill out the details to create a new shipment</p>
      </div>

      {/* Pass all profiles to the form */}
      <CreateShipmentForm profiles={profiles || []} />
    </div>
  );
}
