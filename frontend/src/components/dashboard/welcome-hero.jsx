"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Store, Users, FileText, DoorOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasRole } from "@/utils/user";
import { ROLES } from "@/data/constants";

export function WelcomeHero({ session: initialSession }) {
    const { data: sessionData, status, update } = useSession();
    const router = useRouter();

    // Fallback to passed session prop if useSession hasn't loaded 
    const session = sessionData || initialSession;
    const userName = session?.user?.shortFullName || "Usuario";

    const isSupervisorOnly =
        hasRole(session, [ROLES.SUPERVISOR.slug]) &&
        !hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug]);

    async function handleCompleteStoreManagement(e) {
        e.preventDefault();
        if (session?.store) {
            await update({ store: null });
            router.replace("/");
        }
    }

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
            <div className="grid md:grid-cols-2 gap-6">
                {session?.store ? (
                    <QuickAccessCard
                        href="#"
                        onClick={handleCompleteStoreManagement}
                        icon={DoorOpen}
                        title="Finalizar gestión de tienda"
                        description="Regresar al menú principal para elegir sucursal."
                    />
                ) : isSupervisorOnly ? (
                    <QuickAccessCard
                        href="/supervisor"
                        icon={Users}
                        title="Supervisión"
                        description="Administra sucursales de encargados y personal."
                    />
                ) : (
                    <QuickAccessCard
                        href="/stores"
                        icon={Store}
                        title="Gestión de Tiendas"
                        description="Administra sucursales y configuraciones."
                    />
                )}

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

function QuickAccessCard({ href, onClick, icon: Icon, title, description }) {
    return (
        <Link href={href} onClick={onClick} className="group relative block h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/10 to-sidebar-primary/0 rounded-xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <Card className="relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-md shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-sidebar-primary/5 hover:-translate-y-1">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-sidebar-primary/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-sidebar-primary/20" />
                <div className="absolute bottom-0 left-0 -ml-4 -mb-4 h-20 w-20 rounded-full bg-primary/10 blur-xl transition-all duration-500 group-hover:scale-150" />

                <div className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-sidebar-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <CardContent className="relative z-10 p-6 flex flex-col h-full justify-between gap-6">
                    <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sidebar-primary/10 to-sidebar-primary/5 border border-sidebar-primary/10 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                            <Icon className="size-6 text-sidebar-primary drop-shadow-[0_0_8px_rgba(var(--sidebar-primary),0.5)]" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 transition-colors duration-300 group-hover:bg-sidebar-primary text-muted-foreground group-hover:text-primary-foreground">
                            <ArrowRight className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="font-semibold text-xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-sidebar-primary">{title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
