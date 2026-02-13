"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircleCheckBig } from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarMenuButton } from "@/components/ui/sidebar";

export function CompleteStoreManagementButton({ className, ...props }) {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  async function handleCompleteStoreManagement() {
    if (status === "authenticated" && session?.store) {
      await update({ store: null });
      router.replace("/");
    }
  }

  return (
    <SidebarMenuButton onClick={handleCompleteStoreManagement} className={cn(className)} {...props}>
      <CircleCheckBig />
      <span>Finalizar gestión de tienda</span>
    </SidebarMenuButton>
  );
}
