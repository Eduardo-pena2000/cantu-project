import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";

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
        },
        {
            title: "Asistencia",
            value: presentEmployees,
            icon: UserCheck,
            description: "Presentes hoy",
        },
        {
            title: "Puntualidad",
            value: `${onTimePercentage}%`,
            icon: Clock,
            description: "Llegadas a tiempo",
        },
        {
            title: "Productividad",
            value: "98%", // Placeholder for now
            icon: TrendingUp,
            description: "Promedio global",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
            {stats.map((stat, index) => (
                <Card key={stat.title} className="hover:shadow-lg hover:shadow-sidebar-primary/10 transition-all duration-300 hover:-translate-y-1 border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className="p-2 bg-sidebar-primary/10 rounded-full">
                            <stat.icon className="h-4 w-4 text-sidebar-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
