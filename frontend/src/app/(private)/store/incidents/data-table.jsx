"use client";

import * as React from "react";
import Link from "next/link";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search } from "@/components/search";
import { CustomPagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function DataTable({ defaultData, pagination }) {
    const [data, setData] = React.useState(defaultData);

    React.useEffect(() => {
        setData(defaultData);
    }, [defaultData]);

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Título",
            },
            {
                accessorKey: "category",
                header: "Categoría",
                cell: ({ row }) => {
                    const cat = row.getValue("category");
                    const labels = {
                        maintenance: "Mantenimiento",
                        inventory: "Inventario",
                        hr: "Recursos Humanos",
                        operations: "Operaciones",
                        suggestion: "Sugerencias",
                    };
                    return <span>{labels[cat] || cat}</span>;
                },
            },
            {
                accessorKey: "priority",
                header: "Prioridad",
                cell: ({ row }) => {
                    const priority = row.getValue("priority");
                    const colors = {
                        low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                        high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
                        urgent: "bg-red-500/10 text-red-500 border-red-500/20",
                    };
                    const labels = {
                        low: "Baja",
                        medium: "Media",
                        high: "Alta",
                        urgent: "Urgente"
                    };
                    return (
                        <Badge variant="outline" className={colors[priority]}>
                            {labels[priority]}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "status",
                header: "Estado",
                cell: ({ row }) => {
                    const status = row.getValue("status");
                    const colors = {
                        pending: "bg-slate-500/10 text-slate-500 border-slate-500/20",
                        in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        resolved: "bg-green-500/10 text-green-500 border-green-500/20",
                        rejected: "bg-red-500/10 text-red-500 border-red-500/20",
                    };
                    const labels = {
                        pending: "Pendiente",
                        in_progress: "En progreso",
                        resolved: "Resuelta",
                        rejected: "Rechazada"
                    };
                    return (
                        <Badge variant="outline" className={colors[status]}>
                            {labels[status]}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: "Fecha y hora",
                cell: ({ row }) => {
                    const dateVal = row.getValue("createdAt");
                    const dateObj = new Date(dateVal);
                    if (isNaN(dateObj.getTime())) return <span className="text-white/40">—</span>;
                    const dateStr = formatDate({ date: dateObj });
                    const timeStr = dateObj.toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });
                    return (
                        <div className="flex flex-col">
                            <span>{dateStr}</span>
                            <span className="text-xs text-white/50">{timeStr}</span>
                        </div>
                    );
                },
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/store/incidents/${row.original.id}`}>
                            <Eye className="w-4 h-4 text-primary" />
                        </Link>
                    </Button>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col min-[448px]:flex-row justify-between items-center gap-4">
                <Search className="max-w-md bg-white/5 border-white/10 text-white placeholder:text-white/50" placeholder="Buscar por título" />
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-white/10 hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-white/70">
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-white/10 hover:bg-white/5 border-b transition-colors">
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-white/90">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-white/50">
                                    Sin incidentes reportados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <CustomPagination className="sm:justify-end" totalPages={pagination?.totalPages || 1} />
        </div>
    );
}
