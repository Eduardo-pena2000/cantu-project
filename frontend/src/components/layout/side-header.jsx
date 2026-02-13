"use client";

import Image from "next/image";
import { Sidebar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Notifications } from "@/components/notifications";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex sticky left-0 top-0 z-50 w-full items-center border-b border-primary/10 bg-background shadow-sm">
      <div className="flex h-[var(--header-height)] w-full justify-between items-center gap-2 px-4">
        <div className="flex items-center gap-3">
          <Button className="size-8" variant="ghost" size="icon" onClick={toggleSidebar}>
            <Sidebar className="size-5" />
          </Button>
          <div className="hidden sm:flex items-center gap-2">
            <Image
              className="size-8 aspect-square object-contain"
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary tracking-tight leading-tight">
                El Ofertón de Cantú
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Sistema de Gestión
              </span>
            </div>
          </div>
        </div>
        <Notifications />
      </div>
    </header>
  );
}
