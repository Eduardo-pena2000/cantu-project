import Link from "next/link";
import { House, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { isLinkActive } from "@/utils/link.util";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { id: 1, label: "Inicio", url: "/", icon: House },
  { id: 2, label: "Perfil", url: "/profile", icon: UserRound },
];

export function NavMain({ pathname }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isLinkActive(item.url, pathname) &&
                    "bg-accent-foreground text-accent shadow-md hover:bg-accent-foreground hover:text-accent"
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
