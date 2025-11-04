import { AdminAnalyticsDashboard } from "@/components/admin/admin-analytics-dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminAnalyticsPage() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
        <p className="text-gray-600">
          Comprehensive analytics across all users and shipments
        </p>
      </div>

      <AdminAnalyticsDashboard />
    </div>
  );
}
