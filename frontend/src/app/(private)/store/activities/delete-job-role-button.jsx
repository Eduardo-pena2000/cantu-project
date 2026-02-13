"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteJobRoleById } from "@/actions/job-roles";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteJobRoleButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteJobRole() {
    const res = await deleteJobRoleById(id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-job-role" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-job-role" });
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
        title="¿Desea eliminar el rol de trabajo?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente el rol de trabajo y eliminará los datos de nuestros servidores. Las actividades pertenecientes a este rol de trabajo también serán eliminadas."
        confirmationText="eliminar rol de trabajo"
        onSubmit={handleDeleteJobRole}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar rol de trabajo</span> para confirmar:
          </span>
        }
      />
    </>
  );
}
