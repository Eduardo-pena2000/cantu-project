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
    const res = await fetchApi("/store", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        if (res.status === 404) {
            return [];
        }
        throw new Error("Failed to fetch stores");
    }

    const json = await res.json();

    // Handle different response structures (direct array or paginated)
    let stores = [];
    if (Array.isArray(json.body)) {
        stores = json.body;
    } else if (json.body && Array.isArray(json.body.data)) {
        stores = json.body.data;
    } else if (json.body && Array.isArray(json.body.rows)) {
        stores = json.body.rows;
    }

    return stores;
}

async function getStoreTeamLeader(storeId, accessToken) {
    // Fetching all teams for the store to find leaders
    try {
        const res = await fetchApi(`/team?store=${storeId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (res.ok) {
            const json = await res.json();
            // The backend returns a paginated response in body.data
            const teams = json.body?.data || [];

            // Returning all team leaders for this store
            return teams.map(t => ({
                teamName: t.name,
                manager: t.managers?.[0], // The backend returns an array of managers
                isActive: t.is_active // Use the actual active status from the team entity
            }));
        }
    } catch (error) {
        console.error(`Error fetching teams for store ${storeId}`, error);
    }
    return [];
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
