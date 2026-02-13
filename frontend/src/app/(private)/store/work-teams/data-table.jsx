"use client";

import Link from "next/link";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateTeamsButton } from "@/app/(private)/store/work-teams/rotate-teams-button";
import { Search } from "@/components/search";
import { CustomPagination } from "@/components/pagination";

export function DataTable({ columns, data, pagination, activeTeams }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Search className="md:max-w-md" placeholder="Buscar por nombre" />
        <div className="w-full flex max-[30rem]:flex-col justify-end items-center gap-4">
          {activeTeams >= 2 && <RotateTeamsButton />}
          {activeTeams < 2 && (
            <Button asChild className="max-[30rem]:w-full max-md:flex-1">
              <Link href="/store/work-teams/new">
                <Plus /> Nuevo equipo de trabajo
              </Link>
            </Button>
          )}
        </div>
      </div>

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination className="sm:justify-end" totalPages={pagination.totalPages} />
    </div>
  );
}
