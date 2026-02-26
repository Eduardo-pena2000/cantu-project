import Link from "next/link";
import { MENU_ITEMS as items } from "@/data/menu-items";

import { cn } from "@/lib/utils";
import { hasRole } from "@/utils/user";
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

export function NavAdmin({ session, pathname }) {
  const isAdminOrManager = hasRole(session, [
    ROLES.ADMIN.slug,
    ROLES.GENERAL_MANAGER.slug,
    ROLES.STORE_MANAGER.slug,
    ROLES.SUPERVISOR.slug,
  ]);
  if (
    session &&
    (!session.store || hasRole(session, ROLES.SUPERVISOR.slug)) &&
    hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SUPERVISOR.slug,
    ])
  ) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Gestión global</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.primary
              .filter((item) => {
                if (item.url === "/users" || item.url === "/stores") {
                  return hasRole(session, [ROLES.ADMIN.slug]);
                }
                if (item.url === "/supervisor") {
                  return !hasRole(session, [ROLES.ADMIN.slug]);
                }
                return true;
              })
              .map((item) => (
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

  if (
    session &&
    hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SUPERVISOR.slug
    ]) &&
    session.store
  ) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Gestión de tienda</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.secondary
              .filter(item => {
                if (item.id === 9) { // Incidencias
                  return hasRole(session, [
                    ROLES.ADMIN.slug,
                    ROLES.GENERAL_MANAGER.slug,
                    ROLES.STORE_MANAGER.slug,
                    ROLES.SUPERVISOR.slug
                  ]);
                }
                // Everything else remains untouched
                return hasRole(session, [
                  ROLES.ADMIN.slug,
                  ROLES.GENERAL_MANAGER.slug,
                  ROLES.STORE_MANAGER.slug,
                ]);
              })
              .map((item) => (
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

  if (
    session &&
    session.store &&
    hasRole(session, [ROLES.SHIFT_MANAGER.slug, ROLES.TEMPORARY_SHIFT_MANAGER.slug])
  ) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Gestión de tienda</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.general.map((item) => (
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
