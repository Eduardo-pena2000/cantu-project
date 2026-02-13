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
import { Areas } from "@/app/(private)/store/attendance/recorded-attendance/areas";
import { RenderData } from "@/components/render-data";

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
    <section className="space-y-4 overflow-x-hidden">
      <p className="max-w-prose text-muted-foreground leading-tight text-sm">
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
                        "border p-3 rounded-md grid gap-3",
                        !isPresent && "bg-accent opacity-70"
                      )}
                    >
                      <div className="flex flex-wrap justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <Avatar className="shadow size-9 shrink-0 object-cover aspect-square">
                            <AvatarImage
                              src={employee.image ?? "/user-round.svg"}
                              className="size-9 shrink-0 object-cover aspect-square"
                            />
                            <AvatarFallback className="size-9 shrink-0 object-cover aspect-square">
                              <UserRound />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col leading-none">
                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {employee.fullName}
                            </span>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>

                        {isPresent && (
                          <Button onClick={handleSelectEmployee(employee.id)} size="icon">
                            <ClipboardList />
                          </Button>
                        )}
                      </div>
                      {employee.areas.length > 0 && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Áreas</span>
                          <p>{employee.areas.map((area) => area.name).join(", ")}</p>
                        </div>
                      )}
                      <div className="flex flex-col min-[30rem]:flex-row min-[30rem]:justify-between min-[30rem]:items-center gap-2">
                        <p className="text-sm text-muted-foreground font-semibold">
                          Asistencia registrada: {employee.attendance.status}
                        </p>
                        {employee.attendance.activities.length > 0 && (
                          <Badge>
                            {employee.attendance.activities.length} actividades asignadas
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
              <div className="my-4 grid gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="shadow size-9 shrink-0 object-cover aspect-square">
                    <AvatarImage
                      src={employee?.image ?? "/user-round.svg"}
                      className="size-9 shrink-0 object-cover aspect-square"
                    />
                    <AvatarFallback className="size-9 shrink-0 object-cover aspect-square">
                      <UserRound />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {employee?.fullName}
                    </span>
                    <p className="text-sm text-muted-foreground">{employee?.email}</p>
                  </div>
                </div>
                <div>
                  {employee?.areas?.map((area) => (
                    <Badge key={area.id}>{area.name}</Badge>
                  ))}
                </div>
              </div>
            </DialogHeader>
            <Areas
              key={employee?.id}
              handleClose={handleClose}
              scheduleId={scheduleId}
              employee={employee}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
