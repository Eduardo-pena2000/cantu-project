"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { safeUrlEncode } from "@/utils/url-encode.util";
import { deleteStoreById } from "@/actions/stores";

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

function TableActions({ store }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  async function handleDeleteStore() {
    const res = await deleteStoreById(store.id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-store" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-store" });
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
            <Link href={`/stores/${safeUrlEncode(store.id)}`}>
              <Eye /> Ver detalles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/stores/${safeUrlEncode(store.id)}/edit`}>
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
        key={store.id}
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

export const columns = [
  {
    accessorKey: "name",
    header: "Nombre",
    meta: { label: "Nombre" },
    cell: ({ row }) => {
      const store = row.original;

      return (
        <div className="leading-none flex items-center space-x-2">
          <Image
            src={store.image ?? "/svg/store.svg"}
            alt={`Imagen de la tienda ${store.name}`}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <p>{store.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Código",
    meta: { label: "Código" },
  },
  {
    accessorKey: "municipality",
    header: "Municipio",
    meta: { label: "Municipio" },
  },
  {
    id: "actions",
    meta: { label: "Acciones" },
    cell: ({ row }) => {
      const store = row.original;

      return <TableActions store={store} />;
    },
  },
];
