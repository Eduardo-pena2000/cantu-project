"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { safeUrlEncode } from "@/utils";
import { deleteActivityById } from "@/actions/activities";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function ActivityActions({ activityId, className }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  async function handleDeleteActivity() {
    const res = await deleteActivityById(activityId);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-activity" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-activity" });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={cn(className)}>
          <Button variant="ghost" size="sm">
            <span className="sr-only">Abrir opciones</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/store/activities/${safeUrlEncode(activityId)}`}
              scroll={false}
              className="w-full"
            >
              <Eye /> Ver detalles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/store/activities/${safeUrlEncode(activityId)}/edit`}
              scroll={false}
              className="w-full"
            >
              <SquarePen /> Editar actividad
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setOpenAlertDialog(true)}
            className="font-semibold text-destructive hover:text-destructive focus-within:text-destructive focus:text-destructive"
          >
            <Trash2 className="text-inherit" /> Eliminar actividad
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationAlerDialog
        key={activityId}
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        title="¿Desea eliminar la actividad?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente la actividad y eliminará los datos de nuestros servidores."
        confirmationText="eliminar actividad"
        onSubmit={handleDeleteActivity}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar actividad</span> para confirmar:
          </span>
        }
      />
    </>
  );
}
