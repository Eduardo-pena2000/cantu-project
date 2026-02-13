import { Inbox, Loader, RotateCcw, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function RenderData({
  isPending,
  isError,
  data,
  Skeleton,
  Error,
  Component,
  EmptyData,
  retryFetch,
}) {
  if (isPending) {
    return Skeleton ? (
      <Skeleton />
    ) : (
      <div className="h-40 flex justify-center items-center gap-1.5">
        <Loader className="animate-spin" /> Cargando<span>...</span>
      </div>
    );
  }

  if (!isPending && isError) {
    return Error ? (
      <Error />
    ) : (
      <Alert variant="destructive">
        <TriangleAlert className="text-destructive size-4" />
        <AlertTitle>¡Ha ocurrido un error!</AlertTitle>
        <AlertDescription>
          <p>Ocurrió un error inesperado. Por favor, inténtalo de nuevo en unos momentos.</p>
          {retryFetch && (
            <Button
              onClick={retryFetch}
              variant="outline"
              size="sm"
              className="text-desctructive border-destructive hover:bg-transparent hover:text-destructive"
            >
              Reintentar <RotateCcw />
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isPending && !isError && data) {
    if (data.data.length === 0) {
      return EmptyData ? (
        <EmptyData />
      ) : (
        <Alert>
          <Inbox className="size-4" />
          <AlertTitle>¡Sin resultados!</AlertTitle>
          <AlertDescription>
            No se encontraron resultados disponibles para mostrar.
          </AlertDescription>
        </Alert>
      );
    }

    return <Component data={data} />;
  }
}
