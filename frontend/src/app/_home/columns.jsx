"use client";

import Image from "next/image";
import { ChevronRight, Frown, Meh, Smile, UserRound } from "lucide-react";

import { cn } from "@/lib";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubDataTable } from "./sub-data-table";

function getEmployeeScore(score) {
  if (score === null) {
    return <Meh className="size-10" />;
  } else if (score < 50) {
    return <Frown className="text-destructive size-10" />;
  } else if (score >= 50 && score < 75) {
    return <Meh className="text-yellow-500 size-10" />;
  } else {
    return <Smile className="text-green-600 size-10" />;
  }
}

export const columns = [
  {
    accessorKey: "name",
    header: "Nombre",
    meta: { label: "Nombre" },
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-2">
          <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
            <AvatarImage
              src={employee.image ?? "./user-round.svg"}
              className="size-10 shadow-sm shrink-0 object-cover aspect-square"
            />
            <AvatarFallback className="size-10 shadow-sm shrink-0 object-cover aspect-square">
              <UserRound className="size-10" strokeWidth={1} />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{employee.shortFullName}</span>
            <span className="text-xs text-muted-foreground">{employee.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    meta: { label: "Estado" },
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent justify-start font-normal text-left">
              {getEmployeeScore(employee.score)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles de Tareas</DialogTitle>
            </DialogHeader>
            <SubDataTable row={row} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
