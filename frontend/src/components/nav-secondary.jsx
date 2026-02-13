import { hasRole } from "@/utils/user";

import { CompleteStoreManagementButton } from "@/components/complete-store-management-button";
import { LogOutButton } from "@/components/log-out-button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({ session, pathname, ...props }) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Sesión</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {session &&
            session.store &&
            hasRole(session, ["admin", "general_manager", "store_manager"]) && (
              <SidebarMenuItem>
                <CompleteStoreManagementButton />
              </SidebarMenuItem>
            )}
          <SidebarMenuItem>
            <LogOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
