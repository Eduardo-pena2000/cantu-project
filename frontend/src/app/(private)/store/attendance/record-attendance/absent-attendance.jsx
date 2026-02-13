"use client";

import * as React from "react";

import { ATTENDANCE_STATUS } from "@/data/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function AbsentAttendance({
  open,
  onOpenChange,
  onClose,
  handleTakeAttendance,
  employee,
  disabled,
}) {
  const [isExcused, setIsExcused] = React.useState(false);
  const [observations, setObservations] = React.useState("");

  function handleChange(event) {
    setObservations(event.target.value);
  }

  function handleReset() {
    setIsExcused(false);
    setObservations("");
    onClose();
  }

  function onAnimationEnd() {
    if (open === false) {
      handleReset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onAnimationEnd={onAnimationEnd}>
        <DialogHeader className="text-left">
          <DialogTitle>Confirmar ausencia</DialogTitle>
          <DialogDescription>
            El empleado {employee?.shortFullName} será marcado como <b>Ausente</b>. Por favor,
            confirma si existe un motivo para su inasistencia.
          </DialogDescription>
        </DialogHeader>
        <div className="py-3 grid gap-3">
          <div className="flex items-center gap-3">
            <Checkbox id="status" checked={isExcused} onCheckedChange={setIsExcused} />
            <Label htmlFor="status">El empleado presenta un motivo válido.</Label>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              autoComplete="off"
              rows={3}
              value={observations}
              onChange={handleChange}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={disabled} variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              handleTakeAttendance({
                employee,
                status: isExcused ? ATTENDANCE_STATUS.EXCUSED : ATTENDANCE_STATUS.ABSENT,
                observations,
              })
            }
            disabled={disabled}
            className="disabled:opacity-100 disabled:animate-pulse"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
