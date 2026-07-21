"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getAssistanceHistory } from "@/lib/queries";
import { employeeAssignmentDto } from "@/dtos";

import { Filters } from "@/app/(private)/reports/filters";
import { EmployeePerformanceGrid } from "@/components/dashboard/employee-performance-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Title } from "@/components/title";

const defaultValues = {
  date: { from: new Date(), to: undefined },
  store: undefined,
  area: undefined,
  role: undefined,
  name: "",
};

export function Report() {
  const [filters, setFilters] = React.useState(defaultValues);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["assistance-history", filters],
    queryFn: () =>
      getAssistanceHistory({
        date: filters.date?.from ? format(filters.date.from, "yyyy-MM-dd") : undefined,
        store_id: filters.store,
        area_id: filters.area,
        role_id: filters.role,
        name: filters.name,
      }),
    enabled: !!filters.date.from && !!filters.store,
  });

  function handleFilter(newFilters) {
    setFilters(newFilters);
  }

  // Use the exact same formatting we use for the live dashboard
  const adaptedData = React.useMemo(() => {
    if (!data?.data) return [];
    
    // The endpoint returns an array of AssistanceEntity joined with User.
    // Wait, the backend endpoint returns Assistance models which have `employee` (User).
    // The employeeAssignmentDto expects { id, avatar_url, email, names, username, last_names, assistance }
    return data.data.map((assistance) => {
      const user = assistance.employee;
      return employeeAssignmentDto({
        ...user,
        assistance: assistance,
      });
    });
  }, [data]);

  return (
    <>
      <Filters defaultValues={filters} onSubmit={handleFilter} />

      {isLoading && (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      )}

      {!isLoading && !isError && adaptedData && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <Title level={2} className="text-lg">Resultados Históricos</Title>
            <span className="text-xs font-normal text-muted-foreground border px-2 py-0.5 rounded-full">
              {adaptedData.length} registros
            </span>
          </div>
          <EmployeePerformanceGrid employees={adaptedData} />
        </div>
      )}

      {!isLoading && !isError && adaptedData?.length === 0 && (
         <div className="p-8 border rounded-xl bg-muted/20 text-center animate-slide-up mt-6">
           <p className="text-muted-foreground">No se encontraron registros para los filtros seleccionados.</p>
         </div>
      )}
    </>
  );
}
