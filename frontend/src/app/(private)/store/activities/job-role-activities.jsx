"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ClipboardCheck } from "lucide-react";

import { formatDate } from "@/utils";
import { getJobRoleActivities } from "@/lib/queries";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import { Skeleton } from "@/components/ui/skeleton";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";
import { FetchError } from "@/components/fetch-error";
import { NoResults } from "@/components/no-results";
import { ActivityActions } from "./activity-actions";

function JobRoleActivitiesSkeleton({ items = 10 }) {
  return (
    <ul className="max-w-md flex flex-col gap-4">
      {Array.from({ length: items }, (_, i) => i + 1).map((i) => (
        <li key={i}>
          <Skeleton className="w-full h-40 rounded-xl shadow-sm" />
        </li>
      ))}
    </ul>
  );
}

export function JobRoleActivities({ jobRoleId }) {
  const { page, handlePreviousPage, handleNextPage, handleChangePage, handleResetPagination } =
    usePagination();
  const { search, handleSearch } = useSearch({ onSearch: handleResetPagination });

  const {
    isLoading,
    isFetching,
    isError,
    data: activities,
    refetch,
  } = useQuery({
    queryKey: ["activities", jobRoleId, page, search],
    queryFn: () => getJobRoleActivities({ jobRoleId, page, q: search }),
    placeholderData: keepPreviousData,
  });

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4">
        <ClientSearch
          className="w-full sm:max-w-md"
          placeholder="Buscar por nombre"
          search={search}
          onSearch={handleSearch}
        />

        <JobRoleActivitiesSkeleton items={10} />
      </div>
    );
  }

  if (!isLoading && !isFetching && isError) {
    return (
      <div className="space-y-4">
        <ClientSearch
          className="w-full sm:max-w-md"
          placeholder="Buscar por nombre"
          search={search}
          onSearch={handleSearch}
        />

        <FetchError
          className="max-w-md"
          description="Hubo un error al intentar obtener las actividades para este rol de trabajo. Por favor, intenta nuevamente."
          refetch={refetch}
        />
      </div>
    );
  }

  if (!isLoading && !isFetching && !isError && activities?.data?.length === 0) {
    return (
      <div className="space-y-4">
        <ClientSearch
          className="w-full sm:max-w-md"
          placeholder="Buscar por nombre"
          search={search}
          onSearch={handleSearch}
        />

        <NoResults
          className="max-w-prose"
          description="No se han encontrado actividades para este rol de trabajo."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full">
        <ClientSearch
          className="w-full bg-background/50 shadow-inner border-border/80 focus-within:ring-2 focus-within:ring-sidebar-primary/20 transition-all rounded-lg"
          placeholder="Buscar actividad por nombre..."
          search={search}
          onSearch={handleSearch}
        />
      </div>

      <ul className="w-full flex flex-col gap-4">
        {activities?.data?.map((activity) => (
          <li key={activity.id} className="relative rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 group overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sidebar-primary/40 group-hover:bg-sidebar-primary transition-colors" />
            <ActivityActions activityId={activity.id} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start gap-4">
              <div className="bg-sidebar-primary/10 p-2.5 rounded-xl shrink-0 mt-1">
                <ClipboardCheck className="size-5 text-sidebar-primary" />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground text-lg group-hover:text-sidebar-primary transition-colors">{activity.name}</h4>
                  <p className="text-muted-foreground text-xs font-medium mb-2">
                    {formatDate({ date: new Date(activity.createdAt) })}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{activity.description}</p>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1.5">Sector asociado</span>
                  <div className="inline-flex items-center gap-2 bg-background/60 border border-border/40 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-xs font-mono font-bold bg-muted/50 px-1.5 py-0.5 rounded">{activity.area.code}</span>
                    <span className="text-sm font-medium">{activity.area.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {activities && (
        <ClientPagination
          className="max-w-md mx-0 justify-center"
          totalPages={activities.pagination.lastPage}
          currentPage={page}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onChangePage={handleChangePage}
        />
      )}
    </div>
  );
}
