"use client";

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

export function RemoveAssignedActivity({ handleRemoveAssignedActivity, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>¿Remover actividad?</DialogTitle>
          <DialogDescription>
            Esta acción eliminará la actividad asignada al empleado. Puedes volver a asignarla en
            cualquier momento si es necesario.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleRemoveAssignedActivity}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
