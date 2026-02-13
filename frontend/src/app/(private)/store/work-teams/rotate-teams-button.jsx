"use client";

import * as React from "react";
import { Rotate3d } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { rotateTeams } from "@/actions/teams";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RotateTeamsButton() {
  const [result, rotateTeamsAction, isPending] = React.useActionState(rotateTeams);

  const router = useRouter();

  function handleRotateTeams() {
    React.startTransition(() => rotateTeamsAction());
  }

  React.useEffect(() => {
    if (!result) return;

    if (result.redirectTo) {
      router.replace(result.redirectTo);
    } else if (result.error) {
      toast.error(result.error.message, { id: "team-rotation" });
    } else {
      toast.success(result.message);
    }
  }, [result]);

  return (
    <Button
      disabled={isPending}
      onClick={handleRotateTeams}
      className={cn(
        "max-[30rem]:w-full max-md:flex-1",
        isPending && "disabled:opacity-100 animate-pulse"
      )}
    >
      <Rotate3d /> Rotar equipos de trabajo
    </Button>
  );
}
