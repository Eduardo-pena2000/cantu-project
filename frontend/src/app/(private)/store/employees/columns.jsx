"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { safeUrlEncode } from "@/utils";
import { deleteEmployeeById } from "@/actions/employees";

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

function TableActions({ employee }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  async function handleDeleteEmployee() {
    const res = await deleteEmployeeById(employee.id);

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
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Abrir opciones</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/store/employees/${safeUrlEncode(employee.id)}`}>
              <Eye /> Ver detalles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/store/employees/${safeUrlEncode(employee.id)}/edit`}>
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
        key={employee.id}
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

export const columns = [
  {
    accessorKey: "fullname",
    header: "Nombre",
    meta: { label: "Nombre" },
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-2">
          <Image
            src={user.image}
            alt={`Imagen de ${user.fullname}`}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover shadow"
          />
          <div className="flex flex-col">
            <span>{user.fullname}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Usuario",
    meta: { label: "Usuario" },
  },
  {
    accessorKey: "email",
    header: "Correo electrónico",
    meta: { label: "Correo electrónico" },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    meta: { label: "Teléfono" },
  },
  {
    id: "actions",
    meta: { label: "Acciones" },
    size: 75,
    cell: ({ row }) => {
      const employee = row.original;

      return <TableActions employee={employee} />;
    },
  },
];
