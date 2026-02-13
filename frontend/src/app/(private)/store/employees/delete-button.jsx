"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteEmployeeById } from "@/actions/employees";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteEmployee() {
    const res = await deleteEmployeeById(id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-employee" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-employee" });
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
        title="¿Desea eliminar el empleado?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente el empleado y eliminará los datos de nuestros servidores."
        confirmationText="eliminar empleado"
        onSubmit={handleDeleteEmployee}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar empleado</span> para confirmar:
          </span>
        }
      />
    </>
  );
}
