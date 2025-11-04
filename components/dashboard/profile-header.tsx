"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/lib/types/database";
import { Building2, CheckCircle, Mail, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials =
    profile.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const userTypeLabel =
    profile.user_type === "admin" ? "Administrator" : "Client";
  const userTypeColor =
    profile.user_type === "admin"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";

  return (
    <Card className="sticky top-20">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-blue-600 text-white text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.full_name || "User"}
            </h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={userTypeColor}>{userTypeLabel}</Badge>
            {profile.is_active && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>

          <div className="w-full pt-4 border-t border-gray-200 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="break-all">{profile.email}</span>
            </div>

            {profile.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>{profile.phone}</span>
              </div>
            )}

            {profile.company_name && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>{profile.company_name}</span>
              </div>
            )}

            {profile.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="break-words">
                  {profile.address}, {profile.city}, {profile.state}{" "}
                  {profile.postal_code}
                </span>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
