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
    <div className="space-y-4">
      <ClientSearch
        className="w-full sm:max-w-md"
        placeholder="Buscar por nombre"
        search={search}
        onSearch={handleSearch}
      />

      <ul className="max-w-md flex flex-col gap-4">
        {activities?.data?.map((activity) => (
          <li key={activity.id} className="relative rounded-xl border p-4 shadow-sm">
            <ActivityActions activityId={activity.id} className="absolute top-2 right-1" />
            <ClipboardCheck className="size-4 absolute left-4 top-4 translate-y-1/4" />
            <div className="ml-5.5">
              <div>
                <p>{activity.name}</p>
                <p className="text-muted-foreground text-sm">
                  Creado el {formatDate({ date: new Date(activity.createdAt) })}
                </p>
                <p className="text-muted-foreground text-sm">{activity.description}</p>
              </div>
              <div className="pt-4">
                <div>
                  <span className="text-muted-foreground text-sm font-semibold">Área</span>
                  <p>
                    <span className="text-sm uppercase">{activity.area.code}</span> -{" "}
                    {activity.area.name}
                  </p>
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
