"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "default", className }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}
