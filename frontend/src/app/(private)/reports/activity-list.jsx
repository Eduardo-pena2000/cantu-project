import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FolderX } from "lucide-react";

import { getUserActivitiesReport } from "@/lib/queries";
import { formatDate, formatTime, getActivityScore, getAssigmentStatus } from "@/utils";

import { usePagination } from "@/hooks/use-pagination";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientPagination } from "@/components/client-pagination";

export function ActivityList({ user, value, team, filters, handleOpen }) {
  const { page, handlePreviousPage, handleNextPage, handleChangePage } = usePagination();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["user-activities-report", value, filters, page],
    queryFn: () =>
      getUserActivitiesReport({
        page,
        user: value,
        startDate: format(filters.date.from, "yyyy-MM-dd"),
        endDate: format(filters.date.to, "yyyy-MM-dd"),
        store: filters.store,
        area: filters.area,
        team: team,
        status: filters.status,
        order: filters.order,
      }),
    enabled: user === value,
  });

  if (isLoading) {
    return (
      <ul className="space-y-4">
        {Array.from({ length: 4 }, (_, idx) => (
          <li key={idx} className="space-y-2 p-2 border rounded-md relative">
            <div className="space-y-2 max-w-prose">
              <div>
                <span className="text-muted-foreground">Fecha límite</span>
                <div className="py-1">
                  <Skeleton className="h-4 w-72 rounded-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-xs" />
                <Skeleton className="h-4 w-full rounded-xs" />
                <Skeleton className="h-4 w-full rounded-xs" />
                <Skeleton className="h-4 w-full rounded-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Estado</span>
                  <Skeleton className="h-4 w-20 rounded-xs" />
                </div>
                <div>
                  <span className="text-muted-foreground">Calificación</span>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <Button disabled variant="secondary" size="sm">
                Ver detalles
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (!isLoading && !isError && data) {
    return (
      <div className="space-y-2">
        <ul className="space-y-4">
          {data.data.length > 0 ? (
            data.data.map((assignment) => (
              <li key={assignment.id} className="space-y-2 p-2 border rounded-md relative">
                <div className="space-y-2 max-w-prose">
                  <div>
                    <span className="text-muted-foreground">Fecha límite</span>
                    <p className="capitalize">
                      {formatDate(new Date(assignment.dateAssistance))}{" "}
                      {formatTime(assignment.deadline)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{assignment.activity.name}</span>
                    <p>{assignment.activity.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground">Estado</span>
                      <p>{getAssigmentStatus(assignment)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Calificación</span>
                      {getActivityScore(assignment.note)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <Button onClick={() => handleOpen(assignment.id)} variant="secondary" size="sm">
                    Ver detalles
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderX />
                </EmptyMedia>
                <EmptyTitle>No hay registro de actividades</EmptyTitle>
                <EmptyDescription>
                  Aún no hay actividades disponibles en este apartado. Cuando se asignen nuevas
                  actividades, podrás visualizarlas aquí.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ul>

        <ClientPagination
          totalPages={data.pagination.lastPage}
          currentPage={page}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onChangePage={handleChangePage}
        />
      </div>
    );
  }
}
