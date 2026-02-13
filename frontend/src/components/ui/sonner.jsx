"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border-sidebar-primary/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-sidebar-primary group-[.toast]:text-sidebar-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          title: "group-[.toast]:text-sidebar-primary font-semibold",
        },
      }}
      style={{
        "--normal-bg": "var(--background)",
        "--normal-text": "var(--foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
};

export { Toaster };
