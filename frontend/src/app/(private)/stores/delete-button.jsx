"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteStoreById } from "@/actions/stores";

import { Button } from "@/components/ui/button";
import { ConfirmationAlerDialog } from "@/components/confirmation-alert-dialog";

export function DeleteButton({ id, redirectTo }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const router = useRouter();

  async function handleDeleteStore() {
    const res = await deleteStoreById(id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-store" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-store" });
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
        title="¿Desea eliminar la tienda?"
        message="Esta acción no se puede deshacer. Esto borrará permanentemente la tienda y eliminará los datos de nuestros servidores."
        confirmationText="eliminar tienda"
        onSubmit={handleDeleteStore}
        label={
          <span>
            Ingresa <span className="font-semibold">eliminar tienda</span> para confirmar:
          </span>
        }
      />
    </>
  );
}
