import Link from "next/link";
import { Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { hasRole } from "@/utils";
import { isLinkActive } from "@/utils/link.util";

import { ROLES } from "@/data/constants";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [{ id: 1, label: "Reportes", url: "/reports", icon: Newspaper }];

export function NavInfo({ session, pathname }) {
  if (
    session &&
    hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug])
  ) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Información</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isLinkActive(item.url, pathname) &&
                    "bg-sidebar-primary text-sidebar-primary-foreground shadow-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return null;
}
