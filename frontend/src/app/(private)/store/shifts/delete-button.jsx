"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteShiftById } from "@/actions/shifts";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteShift() {
    const res = await deleteShiftById(id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-shift" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-shift" });
    redirectTo && router.replace(redirectTo);
  }

  return (
    <>
      <Button
        onClick={() => setOpenAlertDialog(true)}
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 />
      </Button>

      <ConfirmationAlerDialog
        key={id}
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        title="¿Desea eliminar el turno?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente el turno y eliminará los datos de nuestros servidores."
        confirmationText="eliminar turno"
        onSubmit={handleDeleteShift}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar turno</span> para confirmar:
          </span>
        }
      />
    </>
  );
}
