"use client";

import type React from "react";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import {useState} from "react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{className?: string}>;
}

interface MobileNavDrawerProps {
  items: NavItem[];
  isAdmin?: boolean;
}

export function MobileNavDrawer({items, isAdmin = false}: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Drawer Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={close} />}

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-50 md:hidden transition-all duration-200",
          isOpen ? "block" : "hidden"
        )}>
        <nav className="container mx-auto px-4 py-4 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  isAdmin
                    ? "text-gray-600 hover:text-red-700 hover:bg-red-50"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                )}>
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
