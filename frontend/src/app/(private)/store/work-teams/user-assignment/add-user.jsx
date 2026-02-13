"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { useMediaQuery } from "@/hooks/use-media-query";
import { assignEmployeeToTeam } from "@/lib/mutations";
import { formatTime } from "@/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function AddUser({ teamId, employeeId, schedules }) {
  const [open, setOpen] = React.useState(false);
  const [days, setDays] = React.useState(new Map());

  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const assignEmployee = useMutation({
    mutationFn: ({ teamId, employeeId, workingDays }) =>
      assignEmployeeToTeam({ teamId, employeeId, workingDays }),
  });

  function handleSelectDay(dayId) {
    return function (checked) {
      setDays((prevState) => {
        const newMap = new Map(prevState);
        checked ? newMap.set(dayId, checked) : newMap.delete(dayId);
        return newMap;
      });
    };
  }

  function handleAssignEmployeeToTeam() {
    if (days.size === 0) return;

    const workingDays = [...days.keys()];

    assignEmployee.mutate(
      { teamId, employeeId, workingDays },
      {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["team", teamId] });
          toast.success("Empleado asignado exitosamente al equipo de trabajo.", {
            id: "assign-employee-to-team",
          });
        },
        onError: (error) => {
          toast.error(error.message, { id: "assign-employee-to-team" });
        },
      }
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon">
            <UserPlus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Horario</DialogTitle>
            <DialogDescription>
              Elige los días de la semana en los que el usuario debe presentarse a su puesto. Marca
              todos los días aplicables para definir su horario habitual y facilitar la programación
              y el control de asistencia.
            </DialogDescription>
          </DialogHeader>
          <RenderSchedules schedules={schedules} days={days} handleSelectDay={handleSelectDay} />
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button
              onClick={() => setOpen(false)}
              disabled={assignEmployee.isPending}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              disabled={days.size === 0 || assignEmployee.isPending}
              onClick={handleAssignEmployeeToTeam}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <UserPlus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="h-full overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Horario</DrawerTitle>
            <DrawerDescription>
              Elige los días de la semana en los que el usuario debe presentarse a su puesto. Marca
              todos los días aplicables para definir su horario habitual y facilitar la programación
              y el control de asistencia.
            </DrawerDescription>
          </DrawerHeader>
          <RenderSchedules
            className="px-4"
            schedules={schedules}
            days={days}
            handleSelectDay={handleSelectDay}
          />
          <DrawerFooter>
            <div className="flex justify-between gap-2">
              <Button onClick={() => setOpen(false)} variant="secondary">
                Cancelar
              </Button>
              <Button disabled={days.size === 0} onClick={handleAssignEmployeeToTeam}>
                Confirmar
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RenderSchedules({ className, schedules, days, handleSelectDay }) {
  return (
    <div className={cn("max-w-prose space-y-4 py-4", className)}>
      {schedules.map((schedule) => (
        <div key={schedule.id} className="grid grid-cols-[16px_1fr] gap-x-4">
          <Checkbox
            id={schedule.id}
            checked={days.has(schedule.id)}
            onCheckedChange={handleSelectDay(schedule.id)}
          />
          <Label htmlFor={schedule.id} className="font-semibold">
            {schedule.day}
          </Label>
          <span className="col-start-2">
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </span>
        </div>
      ))}
    </div>
  );
}
