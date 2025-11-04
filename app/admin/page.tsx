import { AdminOverview } from "@/components/admin/admin-overview";
import { RecentActivity } from "@/components/admin/recent-activity";
import { SystemStats } from "@/components/admin/system-stats";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
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
    .maybeSingle();

  if (!profile || profile.user_type !== "admin") {
    redirect("/auth/error?error=insufficient_permissions");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage shipments, users, and system operations
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <AdminOverview />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <SystemStats />
          </div>
        </div>
      </div>
    </div>
  );
}
