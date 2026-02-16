"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function EmployeePerformanceGrid({ employees }) {

    const getStatusColor = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "bg-green-500/10 border-green-500/50 text-green-700";
        if (overallStatus === 'WARNING') return "bg-yellow-500/10 border-yellow-500/50 text-yellow-700";
        if (overallStatus === 'LATE') return "bg-red-500/10 border-red-500/50 text-red-700";
        return "bg-gray-100 border-gray-200 text-gray-500";
    };

    const getStatusEmoji = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "🙂"; // Happy
        if (overallStatus === 'WARNING') return "😐"; // Serious
        if (overallStatus === 'LATE') return "☹️"; // Sad
        return "😴"; // Pending
    };

    const getStatusLabel = (employee) => {
        const { overallStatus } = employee;
        if (overallStatus === 'EXCELLENT') return "Excelente";
        if (overallStatus === 'WARNING') return "Atención";
        if (overallStatus === 'LATE') return "Tardío";
        return "Pendiente";
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {employees.map((employee) => {
                const colorClass = getStatusColor(employee);

                return (
                    <Card key={employee.id} className={cn("border-2 hover:shadow-md transition-all", colorClass)}>
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="relative">
                                <Avatar className="size-16 border-2 border-background shadow-sm">
                                    <AvatarImage src={employee.image} alt={employee.shortFullName} />
                                    <AvatarFallback>{employee.shortFullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {employee.late > 0 && (
                                    <span className="absolute bottom-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                                        LATE
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 w-full">
                                <h4 className="font-semibold text-sm truncate w-full" title={employee.shortFullName}>
                                    {employee.shortFullName}
                                </h4>
                                <p className="text-xs opacity-80 truncate">{employee.email}</p>
                            </div>

                            <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="text-3xl filter drop-shadow-sm transition-transform hover:scale-110 cursor-default" title={getStatusLabel(employee)}>
                                    {getStatusEmoji(employee)}
                                </div>
                                <Badge variant="outline" className={cn("bg-background/50 backdrop-blur-sm border-current uppercase text-[10px] font-bold tracking-wider", colorClass)}>
                                    {employee.score !== null ? `${employee.score}%` : "--"}
                                </Badge>
                            </div>
                            <p className="text-[10px] font-medium opacity-70 uppercase tracking-widest">{getStatusLabel(employee)}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
