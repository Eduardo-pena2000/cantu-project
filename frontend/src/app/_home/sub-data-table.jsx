"use client";

import * as React from "react";
import Link from "next/link";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Vote } from "lucide-react";

import { formatTime, getActivityScore, getAssigmentStatus, safeUrlEncode } from "@/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function rowsAdapter(assignments) {
  return assignments.map((assignment) => ({
    id: assignment.id,
    name: assignment.activity.name,
    deadline: formatTime(assignment.deadline),
    description: assignment.activity.description,
    status: getAssigmentStatus(assignment),
    score: assignment.score,
  }));
}

function TableActions({ assignment }) {
  return (
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
          <Link href={`/assignment/details/${safeUrlEncode(assignment.id)}`}>
            <Eye /> Ver detalles
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns = [
  {
    accessorKey: "name",
    header: "Actividad",
    meta: { label: "Actividad" },
  },
  {
    accessorKey: "deadline",
    header: "Hora límite",
    meta: { label: "Hora límite" },
  },
  {
    accessorKey: "status",
    header: "Estado",
    meta: { label: "Estado" },
  },
  {
    accessorKey: "score",
    header: "Calificación",
    meta: { label: "Calificación" },
    cell: ({ row }) => getActivityScore(row.original.score),
  },
  {
    id: "actions",
    meta: { label: "Acciones" },
    cell: ({ row }) => <TableActions assignment={row.original} />,
  },
];

export function SubDataTable({ row }) {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <span className="font-semibold">Resumen actividades</span>
        </div>
        <div className="grid">
          <span className="font-semibold">Asignadas</span>
          <span>{row.original.assignments.length}</span>
        </div>
        <div className="grid">
          <span className="font-semibold">Completadas</span>
          <span>{row.original.completed}</span>
        </div>
        <div className="grid">
          <span className="font-semibold">Pendientes</span>
          <span>{row.original.pending}</span>
        </div>
        <div className="grid">
          <span className="font-semibold">Tardías</span>
          <span>{row.original.late}</span>
        </div>
      </div>

      <DataTable columns={columns} data={rowsAdapter(row.original.assignments)} />
    </div>
  );
}

function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
