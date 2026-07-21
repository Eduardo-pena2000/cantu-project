"use client";

import * as React from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { formatTime, getActivityScore, getAssigmentStatus } from "@/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function rowsAdapter(assignments) {
  return assignments.map((assignment) => ({
    id: assignment.id,
    name: assignment.activity.name,
    assignedAt: formatTime(assignment.assignedAt || "08:00:00"),
    deadline: formatTime(assignment.deadline),
    description: assignment.activity.description,
    status: getAssigmentStatus(assignment),
    score: assignment.score,
  }));
}


const columns = [
  {
    accessorKey: "name",
    header: "Actividad",
    meta: { label: "Actividad" },
  },
  {
    accessorKey: "assignedAt",
    header: "Hora Asignada",
    meta: { label: "Hora Asignada" },
  },
  {
    accessorKey: "deadline",
    header: "Hora Límite",
    meta: { label: "Hora Límite" },
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
];

export function SubDataTable({ row }) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-4 border-b pb-2 mb-2">
          <span className="font-semibold text-lg text-primary">Rendimiento Empleados de Tienda</span>
          <p className="text-sm text-muted-foreground leading-tight">Resumen global de actividad en toda la vida</p>
        </div>
        <div className="flex flex-col gap-1 bg-muted/20 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md">
          <span className="font-semibold text-sm">Totales Asignadas</span>
          <span className="text-2xl font-bold">{(row.original.completed || 0) + (row.original.pending || 0) + (row.original.late || 0)}</span>
        </div>
        <div className="flex flex-col gap-1 bg-green-500/10 p-4 rounded-xl border border-green-500/20 shadow-sm transition-all hover:shadow-md">
          <span className="font-semibold text-sm text-green-700">Completadas</span>
          <span className="text-2xl font-bold text-green-700">{row.original.completed}</span>
        </div>
        <div className="flex flex-col gap-1 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 shadow-sm transition-all hover:shadow-md">
          <span className="font-semibold text-sm text-yellow-700">Pendientes</span>
          <span className="text-2xl font-bold text-yellow-700">{row.original.pending}</span>
        </div>
        <div className="flex flex-col gap-1 bg-red-500/10 p-4 rounded-xl border border-red-500/20 shadow-sm transition-all hover:shadow-md">
          <span className="font-semibold text-sm text-red-700">Tardías</span>
          <span className="text-2xl font-bold text-red-700">{row.original.late}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border-b pb-2">
          <span className="font-semibold text-lg text-primary">Tareas Pendientes Activas</span>
        </div>
        <DataTable columns={columns} data={rowsAdapter(row.original.assignments)} />
      </div>
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
                  <TableHead key={header.id} className="whitespace-normal text-xs sm:text-sm">
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
                <TableCell key={cell.id} className="whitespace-normal min-w-[100px] text-xs sm:text-sm">
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
