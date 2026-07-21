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
        return res.body?.data || [];
    } catch (error) {
        return [];
    }
}

async function getStoreTeamLeader(storeId, accessToken) {
    // Mock data for local testing
    return [
      {
        teamName: "Turno Matutino",
        manager: { names: "Encargado", last_names: "Demo", avatar_url: "https://i.pravatar.cc/150?u=" + storeId },
        isActive: true
      }
    ];
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
