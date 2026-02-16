"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MENU_ITEMS } from "@/data/menu-items";

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
                <motion.div key={menuItem.id} variants={item}>
                    <Link href={menuItem.url}>
                        <Card className="glass hover-glow-border cursor-pointer h-full group border-0 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                    {menuItem.label}
                                </CardTitle>
                                <div className="p-2 bg-sidebar-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <menuItem.icon className="h-4 w-4 text-sidebar-primary group-hover:text-primary transition-colors" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {menuItem.description || "Ir a la sección"}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
