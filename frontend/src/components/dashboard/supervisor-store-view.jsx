"use client";

import { Crown, CalendarCheck, AlertCircle, LayoutDashboard, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { EmployeePerformanceGrid } from "@/components/dashboard/employee-performance-grid";

export function SupervisorStoreView({ session, store, schedule, scheduleEmployees, employeesData }) {
    // Adapter data for charts/stats
    // const employeesData = rowsAdapter(scheduleEmployees); // Now passed as prop

    // Find the manager/leader in the current schedule if possible
    // For now, we simulate or try to find a manager in the list
    const manager = employeesData.find(e => e.assignments?.some(a => a.role?.slug === 'store_manager' || a.role?.slug === 'shift_manager')) || employeesData[0]; // Fallback

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <header className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <div>
                        <Title>Resumen General de Tienda</Title>
                        <Subtitle className="text-sidebar-primary flex items-center gap-2">
                            {store.name} <Badge variant="outline">{store.code}</Badge>
                        </Subtitle>
                    </div>
                    <div className="text-right text-muted-foreground text-sm">
                        <p>{format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}</p>
                        <p className="text-xs">Vista de Supervisión</p>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <StatsCards scheduleEmployees={employeesData} />

            {/* Employee Performance Grid (Semaphore) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Title level={2} className="text-lg">Semáforo de Rendimiento</Title>
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">En tiempo real</Badge>
                </div>
                <EmployeePerformanceGrid employees={employeesData} />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Manager/Status Card - Takes 2 cols */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card className="hover-glow-border glass h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Crown className="size-5 text-yellow-500" />
                                Encargado en Turno
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center text-center gap-4">
                            {manager ? (
                                <>
                                    <Avatar className="size-24 border-4 border-sidebar-primary/20">
                                        <AvatarImage src={manager.image} />
                                        <AvatarFallback>{manager.shortFullName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-xl">{manager.shortFullName}</h3>
                                        <p className="text-sm text-muted-foreground">{manager.email}</p>
                                    </div>
                                    <Badge variant={manager.completed ? "default" : "secondary"} className="mt-2">
                                        {manager.completed ? "Turno Completado" : "En Turno"}
                                    </Badge>
                                </>
                            ) : (
                                <div className="p-4 text-muted-foreground italic">
                                    No se identificó encargado en este turno.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Shift Status */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <CalendarCheck className="size-4 text-blue-500" />
                                Estado del Turno
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {schedule ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Inicio:</span>
                                        <span className="font-medium">{schedule.startTime?.slice(0, 5)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Fin:</span>
                                        <span className="font-medium">{schedule.endTime?.slice(0, 5)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="font-medium">{employeesData.length} Empleados</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-yellow-600 text-sm">
                                    <AlertCircle className="size-4" /> Sin turno activo
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Charts - Takes 5 cols */}
                <div className="md:col-span-5">
                    <DashboardCharts employees={employeesData} />
                </div>
            </div>

            {/* We can add more sections here like "Critical Alerts" or "Pending Tasks" specifically for supervisors */}
        </div>
    );
}
