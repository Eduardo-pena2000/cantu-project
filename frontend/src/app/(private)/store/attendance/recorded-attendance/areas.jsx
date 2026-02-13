"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";

import { getAreas } from "@/lib/queries";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";
import { RenderData } from "@/components/render-data";
import { AreaActivities } from "./area-activities";

export function Areas({ handleClose, scheduleId, employee }) {
  const [open, setOpen] = React.useState(null);

  const {
    page,
    handlePreviousPage,
    handleNextPage,
    handleChangePage,
    handleResetPagination,
    containerRef,
  } = usePagination();
  const { search, handleSearch } = useSearch({ onSearch: handleResetPagination });

  const { isPending, isError, data } = useQuery({
    queryKey: ["areas", page, search],
    queryFn: () => getAreas({ page, q: search }),
    enabled: !!employee,
  });

  function handleOpen(id) {
    return function (value) {
      if (value) setOpen(id);
      else setOpen(null);
    };
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="flex items-center gap-2">
        <ClientSearch placeholder="Buscar área" search={search} onSearch={handleSearch} />
        <Button onClick={handleClose} variant="outline">
          <ArrowLeft /> Regresar
        </Button>
      </div>

      <RenderData
        isPending={isPending}
        isError={isError}
        data={data}
        Component={({ data }) => (
          <div className="space-y-4">
            <ul className="space-y-4">
              {data.data.map((area) => (
                <li key={area.id}>
                  <Collapsible open={area.id === open} onOpenChange={handleOpen(area.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="text" size="txt" className="justify-between">
                        <ChevronsUpDown />
                        <span className="text-sm font-semibold">{area.name}</span>
                        <span className="sr-only">{area.name}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent data-state="open">
                      <AreaActivities
                        areaId={area.id}
                        scheduleId={scheduleId}
                        employee={employee}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button onClick={handleClose} variant="outline" className="ml-auto">
                <ArrowLeft /> Regresar
              </Button>
              <ClientPagination
                className="md:justify-end"
                totalPages={data.pagination.lastPage}
                currentPage={page}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onChangePage={handleChangePage}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
