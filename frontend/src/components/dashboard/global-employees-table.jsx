"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronRight, Frown, Meh, Smile, UserRound, Store, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function getEmployeeScore(score) {
    if (score === null || score === undefined) {
        return (
            <div className="flex items-center gap-2">
                <Meh className="text-muted-foreground size-6" />
                <span className="text-sm font-medium text-muted-foreground">Sin Evaluar</span>
            </div>
        );
    } else if (score < 50) {
        return (
            <div className="flex items-center gap-2">
                <Frown className="text-destructive size-6" />
                <span className="text-sm font-medium text-destructive">Baja Productividad</span>
            </div>
        );
    } else if (score >= 50 && score < 75) {
        return (
            <div className="flex items-center gap-2">
                <Meh className="text-yellow-500 size-6" />
                <span className="text-sm font-medium text-yellow-500">Regular</span>
            </div>
        );
    } else {
        return (
            <div className="flex items-center gap-2">
                <Smile className="text-green-500 size-6" />
                <span className="text-sm font-medium text-green-500">Buena Productividad</span>
            </div>
        );
    }
}

export const columns = [
    {
        accessorKey: "name",
        header: "Nombre del Empleado",
        cell: ({ row }) => {
            const employee = row.original;
            return (
                <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-3">
                    <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                        <AvatarImage
                            src={employee.image ?? "./user-round.svg"}
                            className="size-10 shadow-sm shrink-0 object-cover aspect-square"
                        />
                        <AvatarFallback className="size-10 shadow-sm shrink-0 object-cover aspect-square bg-muted/50 text-muted-foreground">
                            <UserRound className="size-5" strokeWidth={1.5} />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground leading-none">{employee.shortFullName}</span>
                        <span className="text-xs text-muted-foreground leading-none">{employee.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Productividad",
        cell: ({ row }) => {
            const employee = row.original;
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent justify-start font-normal text-left">
                            {getEmployeeScore(employee.score)}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Detalles de Asignación</DialogTitle>
                        </DialogHeader>
                        <SubDataTable employee={employee} />
                    </DialogContent>
                </Dialog>
            );
        },
    },
];

function SubDataTable({ employee }) {
    return (
        <div className="grid gap-4 p-4 rounded-xl bg-muted/20 border border-border/50 shadow-inner">
            <div className="grid md:grid-cols-2 gap-6">

                {/* Store Detail */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sidebar-primary">
                        <Store className="size-5" />
                        <span className="font-semibold text-sm">Tienda Asignada</span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border shadow-sm">
                        {employee.store ? (
                            <p className="font-medium text-foreground">{employee.store.name}</p>
                        ) : (
                            <p className="text-muted-foreground text-sm">No asigando a nunguna tienda.</p>
                        )}
                    </div>
                </div>

                {/* Teams/Shifts Detail */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary">
                        <UsersIcon className="size-5" />
                        <span className="font-semibold text-sm">Equipos y Turnos</span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border shadow-sm flex flex-col gap-2">
                        {employee.teams && employee.teams.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {employee.teams.map(team => (
                                    <span key={team.id} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground ring-1 ring-inset ring-border/50">
                                        {team.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">Este usuario no pertecene a ningún equipo.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export function GlobalEmployeesDataTable({ data }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-muted/30">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/40">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="text-muted-foreground font-semibold">
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
                            <React.Fragment key={row.id}>
                                <TableRow data-state={row.getIsSelected() && "selected"} className="group hover:bg-muted/20 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-32 text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <UsersIcon className="size-8 mb-2 opacity-20" />
                                    <p>No hay empleados para mostrar en esta vista global.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
