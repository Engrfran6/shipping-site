"use client";

import {LogoutButton} from "@/components/auth/logout-button";
import {cn} from "@/lib/utils";
import {
  BarChart3,
  DollarSign,
  Home,
  Package,
  PinIcon,
  Plus,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {MobileNavDrawer} from "../mobile-nav-drawer";

const navigation = [
  {name: "Dashboard", href: "/admin", icon: Home},
  {name: "Shipments", href: "/admin/shipments", icon: Package},
  {name: "Events", href: "/admin/events", icon: PinIcon},
  {name: "Users", href: "/admin/users", icon: Users},
  {name: "Analytics", href: "/admin/analytics", icon: BarChart3},
  {name: "Settings", href: "/admin/settings", icon: Settings},
  {name: "Payment Options", href: "/admin/payment-options", icon: DollarSign},
  {name: "Create Shipment", href: "/admin/shipments/create", icon: Plus},
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
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
                        ? "bg-red-100 text-red-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      item.href === "/admin/shipments/create" &&
                        "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                    )}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <LogoutButton />
          <MobileNavDrawer items={navigation} isAdmin />
        </div>
      </div>
    </nav>
  );
}
