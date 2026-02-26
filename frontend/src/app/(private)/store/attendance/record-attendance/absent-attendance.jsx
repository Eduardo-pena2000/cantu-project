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
      <DialogContent onAnimationEnd={onAnimationEnd} className="bg-card/80 backdrop-blur-xl border-border/50 shadow-lg sm:rounded-2xl overflow-hidden p-0 gap-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
        <DialogHeader className="text-left bg-muted/20 p-6 border-b border-border/40 pb-5">
          <DialogTitle className="text-xl text-foreground/90">Confirmar ausencia</DialogTitle>
          <DialogDescription className="text-foreground/70 leading-relaxed mt-2">
            El empleado <span className="font-semibold text-foreground">{employee?.shortFullName}</span> será marcado como{" "}
            <span className="font-bold text-destructive">Ausente</span>. Por favor,
            confirma si existe un motivo para su inasistencia.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 grid gap-5 bg-background/30">
          <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors">
            <Checkbox id="status" checked={isExcused} onCheckedChange={setIsExcused} className="mt-0.5 data-[state=checked]:bg-sidebar-primary data-[state=checked]:text-sidebar-primary-foreground data-[state=checked]:border-sidebar-primary" />
            <div className="grid gap-1">
              <Label htmlFor="status" className="font-medium text-foreground cursor-pointer">
                El empleado presenta un motivo válido.
              </Label>
              <p className="text-xs text-muted-foreground">La falta será registrada como justificada.</p>
            </div>
          </div>
          <div className="grid gap-2.5">
            <Label htmlFor="observations" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Observaciones adicionales
            </Label>
            <Textarea
              id="observations"
              autoComplete="off"
              placeholder="Detalla brevemente la razón de la ausencia..."
              rows={3}
              value={observations}
              onChange={handleChange}
              className="resize-none bg-background/50 border-border/60 shadow-inner focus-visible:ring-sidebar-primary/20 rounded-xl placeholder:text-muted-foreground/50 transition-all"
            />
          </div>
        </div>
        <DialogFooter className="bg-muted/10 p-4 border-t border-border/40 sm:justify-between items-center gap-3">
          <DialogClose asChild>
            <Button disabled={disabled} variant="ghost" className="hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto rounded-xl transition-colors">
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
            className="w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-xl disabled:opacity-100 disabled:animate-pulse"
          >
            Confirmar ausencia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
