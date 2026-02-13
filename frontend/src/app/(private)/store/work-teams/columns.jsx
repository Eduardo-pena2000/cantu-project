"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { safeUrlEncode } from "@/utils";
import { deleteTeamById } from "@/actions/teams";

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

function TableActions({ team }) {
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  async function handleDeleteTeam() {
    const res = await deleteTeamById(team.id);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "delete-team" });
      throw res.error.message;
    }

    setOpenAlertDialog(false);
    toast.success(res.message, { id: "delete-team" });
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
            <Link href={`/store/work-teams/${safeUrlEncode(team.id)}`}>
              <Eye /> Ver detalles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/store/work-teams/${safeUrlEncode(team.id)}/edit`}>
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
        key={team.id}
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
    accessorKey: "shift",
    header: "Turno",
    meta: { label: "Turno" },
  },
  {
    accessorKey: "manager",
    header: "Encargado",
    meta: { label: "Encargado" },
  },
  {
    accessorKey: "status",
    header: "Estatus",
    meta: { label: "Estatus" },
  },
  {
    id: "actions",
    meta: { label: "Acciones" },
    size: 75,
    cell: ({ row }) => {
      const team = row.original;

      if (team.status === "Activo") {
        return <TableActions team={team} />;
      } else {
        return <div className="h-8 w-8" />;
      }
    },
  },
];
