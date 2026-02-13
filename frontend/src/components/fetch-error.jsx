import { RotateCcw, TriangleAlert } from "lucide-react";

import { cn } from "@/lib";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function FetchError({
  className,
  title = "¡Error!",
  description = "Ha ocurrido un error.",
  refetch = undefined,
}) {
  return (
    <Alert variant="destructive" className={cn(className)}>
      <TriangleAlert className="text-destructive size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        {refetch && (
          <Button
            onClick={refetch}
            variant="txt"
            size="sm"
            className="text-muted-foreground ml-auto"
          >
            Reintentar <RotateCcw />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
