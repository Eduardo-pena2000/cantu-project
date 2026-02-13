"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Store, Users, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WelcomeHero({ session }) {
    const userName = session?.user?.shortFullName || "Usuario";

    return (
        <div className="flex flex-col gap-8 animate-fade-in max-w-5xl mx-auto py-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar via-[oklch(0.35_0.10_250)] to-sidebar p-8 md:p-12 text-sidebar-primary-foreground shadow-2xl">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-10">
                    <Image src="/logo.jpg" alt="bg" width={600} height={600} className="rounded-full grayscale" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/20">
                        <Image
                            src="/logo.jpg"
                            alt="Logo El Ofertón"
                            width={120}
                            height={120}
                            className="rounded-xl drop-shadow-md"
                            priority
                        />
                    </div>

                    <div className="text-center md:text-left space-y-4 flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                            ¡Hola, <span className="text-sidebar-primary">{userName}</span>!
                        </h1>
                        <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl leading-relaxed">
                            Bienvenido al Sistema de Gestión de <span className="font-semibold text-white">El Ofertón de Cantú</span>.
                            Selecciona una opción para comenzar.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                            <Button asChild size="lg" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                                <Link href="/profile">
                                    Ver mi perfil <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <QuickAccessCard
                    href="/stores"
                    icon={Store}
                    title="Gestión de Tiendas"
                    description="Administra sucursales y configuraciones."
                />
                <QuickAccessCard
                    href="/users"
                    icon={Users}
                    title="Personal"
                    description="Gestiona empleados y roles."
                />
                <QuickAccessCard
                    href="/reports"
                    icon={FileText}
                    title="Reportes"
                    description="Visualiza métricas y asistencia."
                />
            </div>
        </div>
    );
}

function QuickAccessCard({ href, icon: Icon, title, description }) {
    return (
        <Link href={href} className="group block h-full">
            <Card className="h-full hover:border-sidebar-primary/50 hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-sidebar-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 flex flex-col gap-4">
                    <div className="p-3 bg-primary/5 rounded-xl w-fit group-hover:bg-sidebar-primary/20 transition-colors">
                        <Icon className="size-6 text-primary group-hover:text-sidebar-primary transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
