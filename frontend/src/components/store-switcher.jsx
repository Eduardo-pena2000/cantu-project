"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Settings2 } from "lucide-react";

import { Button } from "./ui/button";

export function StoreSwitcher({
  sessionStore,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}) {
  const { update } = useSession();
  const router = useRouter();

  async function handleSwitchStore() {
    await update({ store: sessionStore });
    router.replace("/");
  }

  return (
    <Button
      onClick={handleSwitchStore}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      <Settings2 />
    </Button>
  );
}
