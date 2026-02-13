"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { safeUrlEncode } from "@/utils";
import { deleteAreaById } from "@/actions/areas";

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

function TableActions({ area }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  async function handleDeleteArea() {
    const res = await deleteAreaById(area.id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-area" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-area" });
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir opciones</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/store/areas/${safeUrlEncode(area.id)}`}>
              <Eye /> Ver detalles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/store/areas/${safeUrlEncode(area.id)}/edit`}>
              <SquarePen /> Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setOpenAlertDialog(true)}
            className="font-semibold text-destructive hover:text-white hover:bg-destructive focus-within:bg-destructive focus:bg-destructive focus-within:text-white focus:text-white"
          >
            <Trash2 className="text-inherit" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationAlerDialog
        key={area.id}
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

export const columns = [
  {
    accessorKey: "name",
    header: "Nombre",
    meta: { label: "Nombre" },
  },
  {
    accessorKey: "code",
    header: "Código",
    meta: { label: "Código" },
  },
  {
    accessorKey: "manager",
    header: "Encargado",
    meta: { label: "Encargado" },
  },
  {
    id: "actions",
    meta: { label: "Acciones" },
    size: 75,
    cell: ({ row }) => {
      const area = row.original;

      return <TableActions area={area} />;
    },
  },
];
