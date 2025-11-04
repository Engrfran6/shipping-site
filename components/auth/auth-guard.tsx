"use client";

import type React from "react";

import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "client" | "admin";
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/auth/login");
          return;
        }

        setUser(user);

        // Get user profile for role checking
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        }

        if (profile) {
          setProfile(profile);

          // Check role requirements
          if (requiredRole && profile.user_type !== requiredRole) {
            router.push("/auth/error?error=insufficient_permissions");
            return;
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, requiredRole]);

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  if (!user && !profile) {
    return null;
  }

  return <>{children}</>;
}
