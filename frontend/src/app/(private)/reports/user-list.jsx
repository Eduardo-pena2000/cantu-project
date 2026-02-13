"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FolderX } from "lucide-react";

import { cn } from "@/lib";
import { getUsersTeamReport } from "@/lib/queries";
import { getUserInitials } from "@/utils";

import { usePagination } from "@/hooks/use-pagination";

import { ActivityList } from "@/app/(private)/reports/activity-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientPagination } from "@/components/client-pagination";

export function UserList({ team, value, filters, handleOpen }) {
  const [user, setUser] = React.useState(null);
  const { page, handlePreviousPage, handleNextPage, handleChangePage } = usePagination();

  function getUserScoreStatus(activities, score) {
    if (activities === 0) {
      return "outline-3 outline-muted-foreground";
    } else if (score < 50) {
      return "outline-3 outline-destructive";
    } else if (score >= 50 && score <= 75) {
      return "outline-3 outline-yellow-500";
    } else {
      return "outline-3 outline-green-600";
    }
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: ["users-team-report", value, filters, page],
    queryFn: () =>
      getUsersTeamReport({
        page,
        team: value,
        startDate: format(filters.date.from, "yyyy-MM-dd"),
        endDate: format(filters.date.to, "yyyy-MM-dd"),
        store: filters.store,
        area: filters.area,
        status: filters.status,
        order: filters.order,
      }),
    enabled: team === value,
  });

  if (isLoading) {
    return (
      <Accordion type="single" collapsible className="w-full pl-4">
        {Array.from({ length: 4 }, (_, idx) => (
          <AccordionItem key={idx}>
            <AccordionTrigger disabled>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 aspect-square rounded-full border" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32 rounded-xs border" />
                  <Skeleton className="h-3 w-40 rounded-xs border" />
                </div>
              </div>
            </AccordionTrigger>
            <div className="max-w-prose pb-4 grid gap-2">
              <span className="text-muted-foreground font-semibold">Resumen de actividades</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Asignadas</span>
                  <Skeleton className="h-4 w-10 rounded-xs border" />
                </div>
                <div>
                  <span className="text-muted-foreground">Completadas</span>
                  <Skeleton className="h-4 w-10 rounded-xs border" />
                </div>
                <div>
                  <span className="text-muted-foreground">Pendientes</span>
                  <Skeleton className="h-4 w-10 rounded-xs border" />
                </div>
                <div>
                  <span className="text-muted-foreground">Tardías</span>
                  <Skeleton className="h-4 w-10 rounded-xs border" />
                </div>
              </div>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  if (!isLoading && !isError && data) {
    return (
      <div className="space-y-2">
        <Accordion
          type="single"
          collapsible
          value={user}
          onValueChange={setUser}
          className="w-full pl-4"
        >
          {data.data.length > 0 ? (
            data.data.map(
              ({
                id,
                image,
                names,
                lastNames,
                shortFullName,
                email,
                assignedActivities,
                completedActivities,
                incompleteActivities,
                lateActivities,
                score,
              }) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger disabled={assignedActivities === 0}>
                    <div className="flex items-center gap-2">
                      <Avatar
                        className={cn(
                          "h-9 w-9 aspect-square",
                          getUserScoreStatus(assignedActivities, score)
                        )}
                      >
                        <AvatarImage src={image} alt={shortFullName} className="object-cover" />
                        <AvatarFallback>{getUserInitials(names, lastNames)}</AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <p>{shortFullName}</p>
                        <p className="text-muted-foreground">{email}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <div className="max-w-prose pb-4 grid gap-2">
                    <span className="text-muted-foreground font-semibold">
                      Resumen de actividades
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Asignadas</span>
                        <p>{assignedActivities}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completadas</span>
                        <p>{completedActivities}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pendientes</span>
                        <p>{incompleteActivities}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tardías</span>
                        <p>{lateActivities}</p>
                      </div>
                    </div>
                  </div>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <ActivityList
                      user={user}
                      value={id}
                      team={value}
                      filters={filters}
                      handleOpen={handleOpen}
                    />
                  </AccordionContent>
                </AccordionItem>
              )
            )
          ) : (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia>
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    <Avatar>
                      <AvatarImage src="/images/bob-johnson.webp" alt="Bob Johnson" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="/images/charlie-brown.webp" alt="Charlie Brown" />
                      <AvatarFallback>UR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="/images/john-doe.webp" alt="John Doe" />
                      <AvatarFallback>UD</AvatarFallback>
                    </Avatar>
                  </div>
                </EmptyMedia>
                <EmptyTitle>No se encontraron registros</EmptyTitle>
                <EmptyDescription>
                  Este equipo de trabajo no presenta registros de actividad de sus integrantes.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </Accordion>

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
