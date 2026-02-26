"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MENU_ITEMS } from "@/data/menu-items";
import { ArrowRight } from "lucide-react";

export function NavigationCards({ role }) {
    // Select items based on role or context. 
    // For now, let's show Secondary items (Store Management) if available, 
    // essentially what the user requested: "cuando se desplieguen las opciones de cada tienda"

    // You might want to pass in 'items' as a prop or determine it here.
    // Assuming this component is used inside a Store context:
    const items = MENU_ITEMS.secondary;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
            {items.map((menuItem) => (
                <motion.div key={menuItem.id} variants={item} className="h-full">
                    <Link href={menuItem.url} className="group relative block h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/10 to-transparent rounded-xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        <Card className="relative h-full overflow-hidden border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-sidebar-primary/5 hover:-translate-y-1">
                            {/* Decorative gradients */}
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-sidebar-primary/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-sidebar-primary/20" />
                            <div className="absolute bottom-0 left-0 h-full w-[3px] bg-gradient-to-b from-sidebar-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <CardContent className="relative z-10 p-6 flex flex-col h-full justify-between gap-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sidebar-primary/10 to-sidebar-primary/5 border border-sidebar-primary/10 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                                        <menuItem.icon className="size-6 text-sidebar-primary drop-shadow-[0_0_8px_rgba(var(--sidebar-primary),0.5)]" />
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 transition-colors duration-300 group-hover:bg-sidebar-primary text-muted-foreground group-hover:text-primary-foreground">
                                        <ArrowRight className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 flex flex-col items-start text-left">
                                    <h3 className="font-semibold text-xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-sidebar-primary">
                                        {menuItem.label}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {menuItem.description || "Gestionar esta sección"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
