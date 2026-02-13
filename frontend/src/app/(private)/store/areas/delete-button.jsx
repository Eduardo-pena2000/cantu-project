"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteAreaById } from "@/actions/areas";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteArea() {
    const promise = await deleteAreaById(id);

    toast.promise(promise, {
      id: "delete-area",
      loading: "Eliminando área...",
      success: (result) => {
        if (result?.error) {
          throw new Error(result.error.message);
        }

        return "Área eliminada exitosamente.";
      },
      error: "Ocurrió un error al eliminar el área. Intenta nuevamente.",
    });

    const { error } = await promise;

    if (!error) {
      setOpenAlertDialog(false);

      redirectTo && router.replace(redirectTo);
    }
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
        title="¿Desea eliminar el área?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente el área y eliminará los datos de nuestros servidores."
        confirmationText="eliminar area"
        onSubmit={handleDeleteArea}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar area</span> para confirmar:
          </span>
        }
      />
    </>
  );
}
