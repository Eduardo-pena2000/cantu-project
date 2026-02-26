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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card/80 p-5 rounded-2xl border border-border/60 shadow-lg shadow-black/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sidebar-primary/50 to-transparent" />

        <div className="relative md:max-w-md w-full">
          <Search className="w-full bg-background/50 shadow-inner border-border/80 focus-within:ring-2 focus-within:ring-sidebar-primary/20 transition-all rounded-lg" placeholder="Buscar por nombre..." />
        </div>
        <div className="w-full flex max-[30rem]:flex-col justify-end items-center gap-4">
          {activeTeams >= 2 && <RotateTeamsButton />}
          {activeTeams < 2 && (
            <Button asChild className="max-[30rem]:w-full max-md:flex-1 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-xl px-6">
              <Link href="/store/work-teams/new">
                <Plus className="mr-2 size-4" /> Nuevo equipo
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="relative rounded-2xl border border-border/60 bg-card/60 shadow-xl shadow-black/5 backdrop-blur-2xl overflow-hidden group/table">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
        <Table>
          <TableHeader className="bg-muted/40 backdrop-blur-sm border-b border-border/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-foreground font-semibold py-4 uppercase text-xs tracking-wider">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group hover:bg-muted/40 hover:shadow-sm transition-all duration-200 border-border/40">
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 group-hover:text-sidebar-primary transition-colors">
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
