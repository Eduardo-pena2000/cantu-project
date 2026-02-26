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
    <Card className="relative w-full bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
      <CardHeader className="flex flex-col bg-muted/20 border-b border-border/40 pb-4">
        <CardTitle className="text-xl text-foreground/90">{jobRole.name}</CardTitle>
        <CardDescription className="font-mono bg-background/50 w-fit px-2 py-0.5 rounded text-xs border border-border/30">{jobRole.code}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
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

      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button asChild variant="ghost" size="icon" className="size-8 bg-background/50 backdrop-blur-md rounded-lg shadow-sm hover:bg-background border border-border/40">
          <Link
            href={`/store/activities/job-roles/${safeUrlEncode(jobRole.id)}/edit`}
            className="cursor-pointer"
          >
            <SquarePen className="size-3.5" />
          </Link>
        </Button>
        <DeleteJobRoleButton id={jobRole.id} className="size-8" />
      </div>

      <CardFooter className="bg-muted/10 border-t border-border/40 pt-4">
        <CardAction className="w-full flex items-center gap-2 justify-end">
          <Button asChild variant="outline" size="sm" className="ml-auto shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary transition-all duration-300">
            <Link href={`/store/activities/job-roles/${safeUrlEncode(jobRole.id)}`}>
              Ver detalles
            </Link>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
