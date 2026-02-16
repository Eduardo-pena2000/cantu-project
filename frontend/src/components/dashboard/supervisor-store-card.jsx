"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Crown, Store as StoreIcon, Users, ExternalLink } from "lucide-react";
import { useState } from "react";
import { safeUrlEncode } from "@/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SupervisorStoreCard({ store, teams }) {
    const { update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectStore = async () => {
        setIsLoading(true);
        try {
            // Update session with the selected store context
            await update({
                store: {
                    id: store.id,
                    name: store.name,
                    code: store.code
                }
            });

            // Redirect to the store details page with encoded ID
            const encodedId = safeUrlEncode(String(store.id));
            router.push(`/stores/${encodedId}`);
            router.refresh();
        } catch (error) {
            console.error("Failed to select store:", error);
            setIsLoading(false);
        }
    };

    return (
        <Card className="hover-glow-border glass overflow-hidden flex flex-col h-full group">
            <CardHeader className="bg-sidebar-primary/5 pb-4 transition-colors group-hover:bg-sidebar-primary/10">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <StoreIcon className="size-5 text-sidebar-primary" />
                        {store.name}
                    </CardTitle>
                    <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">{store.code}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col gap-4">
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Crown className="size-4 text-yellow-500" /> Encargados de Equipo
                    </h4>

                    {teams.length > 0 ? (
                        <div className="space-y-3">
                            {teams.map((team, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border hover:bg-background/80 transition-colors">
                                    <Avatar className="size-8 border-2 border-background">
                                        <AvatarImage src={team.manager?.image} />
                                        <AvatarFallback className="bg-muted text-muted-foreground"><Users className="size-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate">{team.manager?.fullName || "Sin asignar"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{team.teamName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 rounded-lg bg-muted/20 border border-dashed flex flex-col items-center justify-center text-center">
                            <Users className="size-6 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground italic">No hay equipos registrados.</p>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-border/50">
                    <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-sidebar-primary hover:text-sidebar-primary-foreground group/btn"
                        onClick={handleSelectStore}
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Ver detalles y desempeño"}
                        <ExternalLink className="size-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
