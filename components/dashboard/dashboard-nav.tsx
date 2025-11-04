"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Home,
  Package,
  Package2Icon,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Shipments", href: "/dashboard/shipments", icon: Package },
  { name: "Track Shipment", href: "/dashboard/track", icon: Package2Icon },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SwiftShip</span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
