"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubDataTable } from "@/app/_home/sub-data-table";

export function EmployeePerformanceGrid({ employees }) {

    const getStatusColor = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "bg-green-500/10 border-green-500/50 text-green-700";
        if (overallStatus === 'WARNING') return "bg-yellow-500/10 border-yellow-500/50 text-yellow-700";
        if (overallStatus === 'LATE') return "bg-red-500/10 border-red-500/50 text-red-700";
        if (overallStatus === 'NEW') return "bg-blue-500/10 border-blue-500/50 text-blue-700";
        return "bg-gray-100 border-gray-200 text-gray-500";
    };

    const getStatusAccent = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "bg-green-500";
        if (overallStatus === 'WARNING') return "bg-yellow-500";
        if (overallStatus === 'LATE') return "bg-red-500";
        if (overallStatus === 'NEW') return "bg-blue-500";
        return "bg-gray-300";
    };

    const getStatusEmoji = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "🙂"; // Happy
        if (overallStatus === 'WARNING') return "😐"; // Serious
        if (overallStatus === 'LATE') return "☹️"; // Sad
        if (overallStatus === 'NEW') return "😴"; // New/Idle
        return "😐"; // Working/Pending (Regular)
    };

    const getStatusLabel = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "Excelente";
        if (overallStatus === 'WARNING') return "Atención";
        if (overallStatus === 'LATE') return "Tardío";
        if (overallStatus === 'NEW') return "Nuevo";
        return "En turno";
    }

    const sortedEmployees = [...employees].sort((a, b) => {
        const priority = {
            'LATE': 1,
            'WARNING': 2,
            'PENDING': 3,
            'EXCELLENT': 4,
            'NEW': 5
        };
        
        // Use NEW as default if no status is defined (means they have no data at all)
        const statusA = a.overallStatus || 'NEW';
        const statusB = b.overallStatus || 'NEW';
        
        return priority[statusA] - priority[statusB];
    });

    return (
        <div className="flex flex-col border rounded-xl bg-card shadow-sm overflow-hidden">
            {sortedEmployees.map((employee, idx) => {
                const colorClass = getStatusColor(employee);
                const isLast = idx === sortedEmployees.length - 1;

                return (
                    <Dialog key={employee.id}>
                        <DialogTrigger asChild>
                            <div className={cn(
                                "group flex items-center justify-between p-4 transition-colors cursor-pointer hover:bg-muted/40 relative", 
                                !isLast && "border-b"
                            )}>
                                {/* Accent left bar */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2", getStatusAccent(employee))} />
                                
                                <div className="flex items-center gap-4 overflow-hidden ml-2">
                                    <div className="relative shrink-0">
                                        <Avatar className="size-10 border shadow-sm">
                                            <AvatarImage src={employee.image} alt={employee.shortFullName} />
                                            <AvatarFallback>{employee.shortFullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {employee.late > 0 && (
                                            <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                                                LATE
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <h4 className="font-semibold text-sm truncate" title={employee.shortFullName}>
                                            {employee.shortFullName}
                                        </h4>
                                        <p className="text-xs opacity-80 truncate">{employee.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 shrink-0">
                                    <div className="flex flex-col items-end gap-1 hidden sm:flex">
                                        <Badge variant="outline" className={cn("bg-background/50 backdrop-blur-sm uppercase text-[10px] font-bold tracking-wider", colorClass)}>
                                            {employee.score !== null ? `${employee.score}%` : "--"}
                                        </Badge>
                                        <span className="text-[10px] font-medium opacity-70 uppercase tracking-widest">{getStatusLabel(employee)}</span>
                                    </div>
                                    <div className="text-3xl filter drop-shadow-sm transition-transform group-hover:scale-110" title={getStatusLabel(employee)}>
                                        {getStatusEmoji(employee)}
                                    </div>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto overflow-x-hidden">
                            <DialogHeader>
                                <DialogTitle>Detalles de Tareas</DialogTitle>
                            </DialogHeader>
                            <SubDataTable row={{ original: employee }} />
                        </DialogContent>
                    </Dialog>
                );
            })}
        </div>
    );
}
