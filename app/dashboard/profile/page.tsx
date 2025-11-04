import { ProfileForm } from "@/components/dashboard/profile-form";
import { ProfileHeader } from "@/components/dashboard/profile-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">
            Manage your profile and account information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileHeader profile={profile} />
          </div>
          <div className="lg:col-span-2">
            <ProfileForm profile={profile} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
