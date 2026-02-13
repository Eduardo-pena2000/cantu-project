"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserX } from "lucide-react";
import { toast } from "sonner";

import { removeEmployeeFromTeam } from "@/lib/mutations";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function RemoveUser({ teamId, employeeId }) {
  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const removeEmployee = useMutation({
    mutationFn: ({ teamId, employeeId }) => removeEmployeeFromTeam({ teamId, employeeId }),
  });

  function handleRemoveEmployee() {
    removeEmployee.mutate(
      { teamId, employeeId },
      {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["team", teamId] });
          toast.success("Empleado removido exitosamente del equipo de trabajo.", {
            id: "remove-employee-from-team",
          });
        },
        onError: (error) => {
          toast.error(error.message, { id: "remove-employee-from-team" });
        },
      }
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <UserX />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desea continuar?</AlertDialogTitle>
          <AlertDialogDescription>
            Esto removerá el empleado del equipo de trabajo. Podrás reasignarlo de nuevo cuando así
            lo desees.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeEmployee.isPending}>Cancelar</AlertDialogCancel>
          <Button onClick={handleRemoveEmployee} disabled={removeEmployee.isPending}>
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
