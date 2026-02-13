"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getAttendanceByScheduleId } from "@/lib/queries";

import { AllEmployees } from "./all-employees";
import { ScheduleEmployees } from "./schedule-employees";

export function RecordAttendance({ storeId, teamId, scheduleId }) {
  const [open, setOpen] = React.useState("team");

  const {
    isPending: isPendingAttendance,
    isError: isErrorAttendance,
    data,
  } = useQuery({
    queryKey: ["employees-attendance", scheduleId],
    queryFn: () => getAttendanceByScheduleId({ scheduleId }),
  });

  const attendance = data
    ? new Map(data.data.map((employeeAttendance) => [employeeAttendance.id, employeeAttendance]))
    : undefined;

  return (
    <section className="space-y-4 overflow-x-hidden">
      <p className="max-w-prose text-muted-foreground leading-tight text-sm">
        Marca la asistencia de los empleados correspondientes a este turno. También puedes asignar
        actividades específicas a cada uno para llevar un mejor control de sus tareas del día.
      </p>
      <div className="space-y-4">
        <ScheduleEmployees
          open={open}
          onOpenChange={setOpen}
          storeId={storeId}
          teamId={teamId}
          scheduleId={scheduleId}
          isPendingAttendance={isPendingAttendance}
          isErrorAttendance={isErrorAttendance}
          attendance={attendance}
        />
        <AllEmployees
          open={open}
          onOpenChange={setOpen}
          storeId={storeId}
          teamId={teamId}
          scheduleId={scheduleId}
          isPendingAttendance={isPendingAttendance}
          isErrorAttendance={isErrorAttendance}
          attendance={attendance}
        />
      </div>
    </section>
  );
}
