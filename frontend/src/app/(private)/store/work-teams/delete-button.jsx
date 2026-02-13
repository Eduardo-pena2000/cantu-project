"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteTeamById } from "@/actions/teams";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteTeam() {
    const res = await deleteTeamById(id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-team" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-team" });
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
        title="¿Desea eliminar el equipo de trabajo?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente el equipo de trabajo y eliminará los datos de nuestros servidores."
        confirmationText="eliminar equipo de trabajo"
        onSubmit={handleDeleteTeam}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar equipo de trabajo</span> para
            confirmar:
          </span>
        }
      />
    </>
  );
}
