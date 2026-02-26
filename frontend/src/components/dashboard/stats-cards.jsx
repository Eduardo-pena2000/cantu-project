"use client";

import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards({ scheduleEmployees }) {
    const totalEmployees = scheduleEmployees.length;
    const presentEmployees = scheduleEmployees.filter((e) => e.assignments.length > 0).length;

    // Example calculation for on-time percentage (mock logic based on available data)
    const onTimeCount = scheduleEmployees.filter(e => !e.late).length;
    const onTimePercentage = totalEmployees > 0 ? Math.round((onTimeCount / totalEmployees) * 100) : 0;

    const stats = [
        {
            title: "Personal Total",
            value: totalEmployees,
            icon: Users,
            description: "Empleados asignados",
            delay: 0
        },
        {
            title: "Asistencia",
            value: presentEmployees,
            icon: UserCheck,
            description: "Presentes hoy",
            delay: 0.1
        },
        {
            title: "Puntualidad",
            value: onTimePercentage,
            suffix: "%",
            icon: Clock,
            description: "Llegadas a tiempo",
            delay: 0.2
        },
        {
            title: "Productividad",
            value: 98, // Placeholder for now
            suffix: "%",
            icon: TrendingUp,
            description: "Promedio global",
            delay: 0.3
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: stat.delay }}
                    className="h-full"
                >
                    <div className="group relative block h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        <Card className="relative h-full overflow-hidden border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-sidebar-primary/5 hover:-translate-y-1">
                            {/* Decorative elements */}
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sidebar-primary/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-sidebar-primary/60 via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2 pt-5">
                                <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-sidebar-primary uppercase">
                                    {stat.title}
                                </CardTitle>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-muted/50 to-muted shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-sidebar-primary/10">
                                    <stat.icon className="size-5 text-muted-foreground group-hover:text-sidebar-primary transition-colors duration-300" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10 pb-5">
                                <div className="text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
                                    <CountUp
                                        end={stat.value}
                                        duration={2.5}
                                        suffix={stat.suffix || ""}
                                        useEasing={true}
                                    />
                                </div>
                                <p className="text-sm mt-1.5 font-medium text-muted-foreground/80 leading-snug">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
