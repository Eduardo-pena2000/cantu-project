"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { getAttendanceByScheduleId } from "@/lib/queries";
import { ATTENDANCE_STATUS } from "@/data/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RenderData } from "@/components/render-data";
import { RoleActivitiesAssigner } from "./role-activities-assigner";

export function RecordedAttendance({ scheduleId }) {
  const [open, setOpen] = React.useState(false);
  const [employeeId, setEmployeeId] = React.useState(null);

  const { isPending, isError, data } = useQuery({
    queryKey: ["employees-attendance", scheduleId],
    queryFn: () => getAttendanceByScheduleId({ scheduleId }),
  });

  const employee = React.useMemo(() => {
    if (!data || !employeeId) return null;

    const foundEmployee = data.data.find((employee) => employeeId === employee.id);

    return foundEmployee ?? null;
  }, [employeeId, data]);

  function handleClose() {
    setOpen(false);
  }

  function handleSelectEmployee(user) {
    return function () {
      setOpen(true);
      setEmployeeId(user);
    };
  }

  function onAnimationEnd() {
    if (open === false) {
      setEmployeeId(null);
    }
  }

  return (
    <section className="space-y-6 overflow-x-hidden relative min-h-[400px]">
      <p className="max-w-prose text-sm text-foreground/70 bg-card/60 backdrop-blur-md px-4 py-3 rounded-xl border border-border/40 leading-relaxed shadow-sm relative z-10">
        Consulta quiénes han sido registrados como presentes durante el turno y revisa las
        actividades que ya han sido asignadas. También puedes agregar nuevas actividades a los
        empleados directamente desde esta sección.
      </p>
      <div className="grid grid-cols-[min(100%)_min(100%)] space-x-4 transition-transform duration-500">
        <RenderData
          isPending={isPending}
          isError={isError}
          data={data}
          Component={({ data }) => (
            <div className="space-y-4">
              <ul className="flex flex-col gap-4">
                {data.data.map((employee) => {
                  const isPresent = employee.attendance.status === ATTENDANCE_STATUS.PRESENT;

                  return (
                    <li
                      key={employee.id}
                      className={cn(
                        "bg-card/80 backdrop-blur-md border border-border/50 p-4 rounded-2xl grid gap-4 relative overflow-hidden transition-all duration-300 group hover:shadow-md",
                        !isPresent ? "opacity-60 grayscale-[0.5]" : "shadow-sm"
                      )}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sidebar-primary/40 group-hover:bg-sidebar-primary transition-colors" />
                      <div className="flex flex-wrap justify-between gap-3 pl-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="shadow-md size-11 ring-2 ring-background shrink-0 object-cover aspect-square transition-transform group-hover:scale-105">
                            <AvatarImage
                              src={employee.image ?? "/user-round.svg"}
                              className="size-11 shrink-0 object-cover aspect-square"
                            />
                            <AvatarFallback className="size-11 shrink-0 object-cover aspect-square bg-sidebar-primary/10 text-sidebar-primary">
                              <UserRound className="size-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col leading-none space-y-1">
                            <span className="text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-sidebar-primary">
                              {employee.fullName}
                            </span>
                            <p className="text-xs text-muted-foreground font-medium">{employee.email}</p>
                          </div>
                        </div>

                        {isPresent && (
                          <Button onClick={handleSelectEmployee(employee.id)} size="icon" variant="outline" className="shadow-sm hover:shadow-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary transition-all duration-300 rounded-xl size-9">
                            <ClipboardList className="size-4" />
                          </Button>
                        )}
                      </div>
                      {employee.areas.length > 0 && (
                        <div className="pl-2 pt-2 border-t border-border/40 mt-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Áreas asignadas</span>
                          <div className="flex flex-wrap gap-1.5">
                            {employee.areas.map((area) => (
                              <span key={area.id} className="text-xs font-medium bg-muted/50 border border-border/50 px-2 py-0.5 rounded-md text-foreground/80">{area.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col min-[30rem]:flex-row min-[30rem]:justify-between min-[30rem]:items-center gap-3 pl-2 pt-3 border-t border-border/40 mt-1">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", isPresent ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted-foreground")} />
                          <p className="text-[13px] text-foreground font-medium">
                            Asistencia: <span className="font-bold text-foreground capitalize">{employee.attendance.status}</span>
                          </p>
                        </div>
                        {employee.attendance.activities.length > 0 && (
                          <Badge variant="secondary" className="bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20 shadow-sm px-2.5 py-0.5 whitespace-nowrap">
                            {employee.attendance.activities.length} actividades
                          </Badge>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        />

        <Dialog open={open} onOpenChange={setOpen} className="!flex !flex-col">
          <DialogContent
            onOpenAutoFocus={(event) => event.preventDefault()}
            onAnimationEnd={onAnimationEnd}
            className="h-dvh max-h-dvh !max-w-full rounded-none duration-500"
          >
            <DialogHeader className="text-left max-w-prose">
              <DialogTitle>Actividades</DialogTitle>
              <DialogDescription>
                Elige las actividades que el empleado deberá realizar. Las actividades se encuentran
                organizadas por áreas de trabajo para facilitar su selección.
              </DialogDescription>
              <div className="my-6 grid gap-6 bg-muted/20 p-5 rounded-2xl border border-border/40">
                <div className="flex items-center gap-4">
                  <Avatar className="shadow-md size-12 ring-2 ring-background shrink-0 object-cover aspect-square">
                    <AvatarImage
                      src={employee?.image ?? "/user-round.svg"}
                      className="size-12 shrink-0 object-cover aspect-square"
                    />
                    <AvatarFallback className="size-12 shrink-0 object-cover aspect-square bg-sidebar-primary/10 text-sidebar-primary">
                      <UserRound className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-none space-y-1.5">
                    <span className="text-base font-semibold tracking-tight text-foreground">
                      {employee?.fullName}
                    </span>
                    <p className="text-sm text-muted-foreground font-medium">{employee?.email}</p>
                  </div>
                </div>
                {employee?.areas && employee.areas.length > 0 && (
                  <div className="pt-4 border-t border-border/40">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2.5">Áreas de especialidad</span>
                    <div className="flex flex-wrap gap-2">
                      {employee.areas.map((area) => (
                        <Badge key={area.id} variant="secondary" className="bg-background shadow-sm border-border/50">{area.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 mt-2 border-t border-border/40">
                  <RoleActivitiesAssigner employee={employee} scheduleId={scheduleId} handleClose={handleClose} />
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
