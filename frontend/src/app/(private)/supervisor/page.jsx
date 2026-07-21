import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Crown, Store as StoreIcon, Users } from "lucide-react";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { hasRole } from "@/utils/user";
import { ROLES } from "@/data/constants";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { SupervisorStoreCard } from "@/components/dashboard/supervisor-store-card";

async function getStores(accessToken) {
    try {
        const res = await fetchApi("/store?limit=100", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const json = await res.json();
        return json.body?.data || [];
    } catch (error) {
        return [];
    }
}

async function getStoreTeamLeader(storeId, accessToken) {
    try {
        const res = await fetchApi(`/team?store=${storeId}&limit=100`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const json = await res.json();
        const teams = json.body?.data || [];
        return teams.map(team => {
            const mainManager = team.managers?.find(m => m.manager_info?.is_main_manager);
            return {
                teamName: team.name || "Sin nombre",
                manager: mainManager ? {
                    names: mainManager.names,
                    last_names: mainManager.last_names,
                    fullName: `${mainManager.names} ${mainManager.last_names}`,
                    image: mainManager.avatar_url || null,
                    avatar_url: mainManager.avatar_url || null,
                } : null,
                isActive: team.is_active,
            };
        });
    } catch (error) {
        return [];
    }
}


export default async function SupervisorPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    if (!hasRole(session, [ROLES.SUPERVISOR.slug, ROLES.ADMIN.slug])) {
        return redirect("/");
    }

    const stores = await getStores(session.accessToken);

    return (
        <div className="flex flex-col gap-6 animate-fade-in p-6">
            <header className="flex flex-col gap-2">
                <Title>Panel de Supervisión</Title>
                <Subtitle>Resumen de Tiendas y Encargados</Subtitle>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stores.map(async (store) => {
                    const teams = await getStoreTeamLeader(store.id, session.accessToken);
                    return (
                        <SupervisorStoreCard key={store.id} store={store} teams={teams} />
                    );
                })}
            </div>

            {stores.length === 0 && (
                <div className="text-center p-12 glass rounded-xl border-dashed">
                    <p className="text-muted-foreground">No hay tiendas registradas en el sistema.</p>
                </div>
            )}
        </div>
    );
}
