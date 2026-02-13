"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { XIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavInfo } from "@/components/nav-info";
import { NavAdmin } from "@/components/nav-admin";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }) {
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar
      className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height))] left-0 border-r border-sidebar-primary/10"
      {...props}
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="w-full flex justify-end items-center py-2 md:hidden">
              <Button
                onClick={toggleSidebar}
                size="icon"
                variant="ghost"
                className="size-4 ring-offset-background focus:ring-ring data-[state=open]:bg-secondary rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-0 focus:ring-offset-0 focus:outline-hidden text-sidebar-foreground"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>
            {/* User info with accent border */}
            <div className="pt-0 md:pt-0 flex items-center gap-3 px-1">
              <div className="relative">
                <Image
                  className="size-10 shadow-sm aspect-square object-cover object-center rounded-lg ring-2 ring-sidebar-primary/50"
                  src={session?.user?.image ?? "/user-round.svg"}
                  alt="Avatar"
                  width={40}
                  height={40}
                />
                <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-sidebar" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-sidebar-foreground">{session?.user?.shortFullName}</span>
                <span className="truncate text-xs text-sidebar-foreground/60">{session?.user?.username}</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain pathname={pathname} />
        <NavInfo session={session} pathname={pathname} />
        <NavAdmin session={session} pathname={pathname} />
        <NavSecondary session={session} pathname={pathname} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1">
          <div className="size-2 rounded-full bg-sidebar-primary" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground/90 text-xs">El Ofertón de Cantú®</span>
            <span className="truncate text-[10px] text-sidebar-foreground/40">© 2025 Todos los derechos reservados</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
