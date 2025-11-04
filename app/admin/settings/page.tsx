import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if the user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.user_type !== "admin") {
    redirect("/auth/error?error=insufficient_permissions");
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your profile and global system configurations
      </p>

      <AdminSettingsForm adminProfile={profile} />
    </div>
  );
}
