import Link from "next/link";
import {
  Boxes,
  CalendarClock,
  ClipboardList,
  Handshake,
  Store,
  UserCheck,
  UsersRound,
} from "lucide-react";

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

const items = {
  primary: [
    { id: 1, label: "Usuarios", url: "/users", icon: UsersRound },
    { id: 2, label: "Tiendas", url: "/stores", icon: Store },
  ],
  secondary: [
    { id: 3, label: "Empleados", url: "/store/employees", icon: UsersRound },
    { id: 4, label: "Áreas", url: "/store/areas", icon: Boxes },
    { id: 5, label: "Turnos", url: "/store/shifts", icon: CalendarClock },
    { id: 6, label: "Equipos de trabajo", url: "/store/work-teams", icon: Handshake },
    { id: 7, label: "Actividades", url: "/store/activities", icon: ClipboardList },
    { id: 8, label: "Asistencia", url: "/store/attendance", icon: UserCheck },
  ],
  general: [
    { id: 1, label: "Actividades", url: "/store/activities", icon: ClipboardList },
    { id: 2, label: "Asistencia", url: "/store/attendance", icon: UserCheck },
  ],
};

export function NavAdmin({ session, pathname }) {
  if (
    session &&
    !session.store &&
    hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug])
  ) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Gestión global</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.primary.map((item) => (
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
    hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug]) &&
    session.store
  ) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Gestión de tienda</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.secondary.map((item) => (
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
