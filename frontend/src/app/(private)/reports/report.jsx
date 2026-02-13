"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getTeamsReport } from "@/lib/queries";

import { Filters } from "@/app/(private)/reports/filters";
import { UserList } from "@/app/(private)/reports/user-list";
import { ReportDetails } from "@/app/(private)/reports/report-details";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const defaultValues = {
  date: { from: undefined, to: undefined },
  store: undefined,
  area: undefined,
  status: undefined,
  order: "asc",
};

export function Report() {
  const [team, setTeam] = React.useState(null);
  const [assignment, setAssignment] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = React.useState(defaultValues);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["teams-report", filters],
    queryFn: () =>
      getTeamsReport({
        startDate: format(filters.date.from, "yyyy-MM-dd"),
        endDate: format(filters.date.to, "yyyy-MM-dd"),
        store: filters.store,
        area: filters.area,
        status: filters.status,
        order: filters.order,
      }),
    enabled: !!filters.date.from && !!filters.date.to && !!filters.store,
  });

  function handleFilter(filters) {
    setFilters(filters);
  }

  function handleOpen(assignment) {
    setAssignment(assignment);
    setOpen(true);
  }

  if (isLoading) {
    return (
      <Accordion type="single" collapsible className="w-full">
        {Array.from({ length: 4 }, (_, idx) => (
          <AccordionItem key={idx}>
            <AccordionTrigger disabled className="pb-4">
              <Skeleton className="h-4 w-56 rounded-xs border" />
            </AccordionTrigger>
            <div className="text-muted-foreground text-sm space-y-2 pb-4">
              <Skeleton className="h-4 w-32 rounded-xs border" />
              <Skeleton className="h-3 w-32 rounded-xs border" />
              <Skeleton className="h-3 w-24 rounded-xs border" />
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  if (!isLoading && !isError && data) {
    return (
      <>
        <Accordion
          type="single"
          collapsible
          value={team}
          onValueChange={setTeam}
          className="w-full"
        >
          {data.data.map(({ id, name, code, isActive }) => (
            <AccordionItem key={id} value={id}>
              <AccordionTrigger className="pb-2">{name}</AccordionTrigger>
              <div className="text-muted-foreground text-sm pb-4">
                <p className="font-semibold">{code}</p>
                <p>25-09-2025</p>
                <p>{isActive ? "Activo" : "Archivado"}</p>
              </div>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <UserList team={team} value={id} filters={filters} handleOpen={handleOpen} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Filters defaultValues={filters} onSubmit={handleFilter} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-prose">
            <DialogHeader className="text-left">
              <DialogTitle>Detalle de la actividad</DialogTitle>
              <DialogDescription>
                Consulta el detalle del cumplimiento y seguimiento de esta actividad.
              </DialogDescription>
            </DialogHeader>
            <ReportDetails open={open} assignment={assignment} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Regresar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <Filters defaultValues={filters} onSubmit={handleFilter} />;
}
