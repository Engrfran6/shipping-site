import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentShipments } from "@/components/dashboard/recent-shipments";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || "User"}!
          </h1>
          <p className="text-gray-600">
            Manage your shipments and track your packages
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <DashboardOverview userId={user.id} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentShipments userId={user.id} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
