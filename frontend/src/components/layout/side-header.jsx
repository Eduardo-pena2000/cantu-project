"use client";

import { Sidebar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Notifications } from "@/components/notifications";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex sticky left-0 top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[var(--header-height)] w-full justify-between items-center gap-2 px-4">
        <Button className="size-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <Sidebar className="size-5" />
        </Button>
        <Notifications />
      </div>
    </header>
  );
}
