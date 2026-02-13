"use client";

import * as React from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus, RotateCcw, SquarePen, TriangleAlert } from "lucide-react";

import { safeUrlEncode } from "@/utils";
import { getJobRoleActivities } from "@/lib/queries";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";
import { FetchError } from "@/components/fetch-error";
import { NoResults } from "@/components/no-results";
import { ActivityCard } from "./activity-card";
import { DeleteJobRoleButton } from "./delete-job-role-button";

function JobRoleActivitiesSkeleton({ items = 10 }) {
  return (
    <ul className="max-w-md flex flex-col gap-4">
      {Array.from({ length: items }, (_, i) => i + 1).map((i) => (
        <li key={i} className="not-last:border-b-2 py-6">
          <Skeleton className="w-full h-40 rounded-xl shadow-sm" />
        </li>
      ))}
    </ul>
  );
}

export function JobRoleCard({ jobRole }) {
  const [open, setOpen] = React.useState(false);
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
    queryKey: ["activities", jobRole.id, page, search],
    queryFn: () => getJobRoleActivities({ jobRoleId: jobRole.id, page, q: search }),
    placeholderData: keepPreviousData,
    enabled: open,
  });

  return (
    <Card className="relative sm:max-w-lg">
      <CardHeader className="flex flex-col">
        <CardTitle>{jobRole.name}</CardTitle>
        <CardDescription>{jobRole.code}</CardDescription>
      </CardHeader>

      <CardContent>
        <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
          <div className="flex flex-wrap justify-between items-center gap-y-2 gap-x-4">
            <CollapsibleTrigger
              asChild
              className="[&[data-state=open]>svg]:rotate-90 [&[data-state=open]+.add-btn]:inline-flex"
            >
              <Button variant="txt" size="sm" className="collapse-btn has-[>svg]:px-0">
                <ChevronRight className="transition-transform duration-200" />
                <span>Actividades</span>
                <span className="sr-only">Actividades del rol de trabajo {jobRole.name}</span>
              </Button>
            </CollapsibleTrigger>
            <Button asChild variant="txt" size="sm" className="add-btn hidden has-[>svg]:px-0">
              <Link
                href={`/store/activities/new?job-role=${safeUrlEncode(jobRole.id)}`}
                scroll={false}
              >
                <Plus /> Agregar actividad
                <span className="sr-only">Agregar actividad al rol de trabajo {jobRole.name}</span>
              </Link>
            </Button>
          </div>
          {open && (
            <CollapsibleContent>
              <div className="space-y-4">
                <ClientSearch
                  placeholder="Buscar actividad"
                  search={search}
                  onSearch={handleSearch}
                />

                {isLoading || isFetching ? (
                  <JobRoleActivitiesSkeleton items={10} />
                ) : !isLoading && !isFetching && isError ? (
                  <FetchError
                    description="Hubo un error al intentar obtener las actividades para este rol de trabajo. Por favor, intenta nuevamente."
                    refetch={refetch}
                  />
                ) : !isError && activities?.data?.length ? (
                  <div className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-4">
                      {activities?.data?.map((activity) => (
                        <li key={activity.id} className="not-last:border-b-2">
                          <ActivityCard activity={activity} />
                        </li>
                      ))}
                    </ul>

                    {activities && (
                      <ClientPagination
                        totalPages={activities.pagination.lastPage}
                        currentPage={page}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        onChangePage={handleChangePage}
                      />
                    )}
                  </div>
                ) : (
                  <NoResults description="No se han encontrado actividades para este rol de trabajo." />
                )}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </CardContent>

      <CardFooter>
        <CardAction className="w-full flex items-center gap-2">
          <DeleteJobRoleButton id={jobRole.id} />
          <Button asChild variant="ghost" size="icon">
            <Link
              href={`/store/activities/job-roles/${safeUrlEncode(jobRole.id)}/edit`}
              className="cursor-default"
            >
              <SquarePen />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="ml-auto">
            <Link href={`/store/activities/job-roles/${safeUrlEncode(jobRole.id)}`}>
              Ver detalles
            </Link>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
