"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteActivityById } from "@/actions/activities";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteActivityButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteActivity() {
    const res = await deleteActivityById(id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-activity" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-activity" });
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
