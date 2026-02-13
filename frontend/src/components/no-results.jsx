import { Inbox } from "lucide-react";

import { cn } from "@/lib";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NoResults({ className, description }) {
  return (
    <Alert className={cn(className)}>
      <Inbox className="size-4" />
      <AlertTitle>Sin resultados.</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}
