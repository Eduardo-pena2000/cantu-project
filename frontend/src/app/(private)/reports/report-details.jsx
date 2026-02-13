"use client";

import { useQuery } from "@tanstack/react-query";

import { getAssignmentDetail } from "@/lib/queries";
import {
  formatDate,
  formatTime,
  getActivityScore,
  getAssigmentStatus,
  getUserInitials,
} from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

export function ReportDetails({ open, assignment }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["assignment-detail", assignment],
    queryFn: () => getAssignmentDetail(assignment),
    enabled: open,
  });

  if (isLoading) {
    return (
      <div className="h-[25svh] grid place-content-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isLoading && !isError && data) {
    return (
      <div className="py-4 grid gap-2">
        <div>
          <span className="text-muted-foreground font-semibold">Actividad</span>
          <p className="leading-tight">{data.data.activity.name}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-semibold">Descripción</span>
          <p className="leading-tight">{data.data.activity.description}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-semibold">Fecha límite</span>
          <p className="capitalize leading-tight">
            {formatDate(new Date(data.data.attendance.date))} {formatTime(data.data.deadline)}
          </p>
        </div>
        <div className="grid gap-1">
          <span className="text-muted-foreground font-semibold">Asignado por</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 aspect-square shadow-sm">
              <AvatarImage
                src={data.data.attendance.takenEmployee.image}
                alt={data.data.attendance.takenEmployee.shortFullName}
                className="object-cover"
              />
              <AvatarFallback>
                {getUserInitials(
                  data.data.attendance.takenEmployee.names,
                  data.data.attendance.takenEmployee.lastNames
                )}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p>{data.data.attendance.takenEmployee.fullName}</p>
              <p className="text-muted-foreground">{data.data.attendance.takenEmployee.email}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-1">
          <span className="text-muted-foreground font-semibold">Asignado a</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 aspect-square shadow-sm">
              <AvatarImage
                src={data.data.attendance.employee.image}
                alt={data.data.attendance.employee.shortFullName}
                className="object-cover"
              />
              <AvatarFallback>
                {getUserInitials(
                  data.data.attendance.employee.names,
                  data.data.attendance.employee.lastNames
                )}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p>{data.data.attendance.employee.fullName}</p>
              <p className="text-muted-foreground">{data.data.attendance.employee.email}</p>
            </div>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground font-semibold">Estatus</span>
          <p className="leading-tight">{getAssigmentStatus(data.data)}</p>
        </div>
        <div className="grid gap-1">
          <span className="text-muted-foreground font-semibold">Calificación del encargado</span>
          {getActivityScore(data.data.shiftManagerScore)}
        </div>
        <div>
          <span className="text-muted-foreground font-semibold">Comentario del encargado</span>
          <p className="leading-tight">{data.data.shiftManagerComment ?? "Sin observaciones."}</p>
        </div>
        <div className="grid gap-1">
          <span className="text-muted-foreground font-semibold">Calificación del gerente</span>
          {getActivityScore(data.data.managerScore)}
        </div>
        <div>
          <span className="text-muted-foreground font-semibold">Comentario del gerente</span>
          <p className="leading-tight">{data.data.managerComment ?? "Sin observaciones."}</p>
        </div>
        <div className="grid gap-1">
          <span className="text-muted-foreground font-semibold">Calificación final</span>
          {getActivityScore(data.data.score)}
        </div>
      </div>
    );
  }
}
