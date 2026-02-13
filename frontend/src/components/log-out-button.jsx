"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarMenuButton } from "@/components/ui/sidebar";

export function LogOutButton({ className, ...props }) {
  async function handlesignOut() {
    await signOut({ redirectTo: "/login" });
  }

  return (
    <SidebarMenuButton
      onClick={handlesignOut}
      className={cn("text-destructive hover:text-destructive", className)}
      {...props}
    >
      <LogOut />
      <span>Cerrar sesión</span>
    </SidebarMenuButton>
  );
}
