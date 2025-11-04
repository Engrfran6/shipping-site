import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Search, User } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Track Package",
      description: "Track any shipment",
      href: "/track",
      icon: Search,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "View Analytics",
      description: "See shipping stats",
      href: "/dashboard/analytics",
      icon: BarChart3,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Update Profile",
      description: "Manage your account",
      href: "/dashboard/profile",
      icon: User,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              asChild
              className={`w-full justify-start text-white ${action.color}`}
            >
              <Link href={action.href}>
                <Icon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
