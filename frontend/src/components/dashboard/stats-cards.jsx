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
                >
                    <Card className="hover:shadow-lg hover:shadow-sidebar-primary/10 transition-all duration-300 hover:-translate-y-1 border-primary/10 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className="p-2 bg-sidebar-primary/10 rounded-full">
                                <stat.icon className="h-4 w-4 text-sidebar-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                <CountUp
                                    end={stat.value}
                                    duration={2}
                                    suffix={stat.suffix || ""}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
