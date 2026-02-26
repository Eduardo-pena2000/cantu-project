import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";

export default async function IncidentsPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams?.page) || 1;
    const limit = Number(resolvedParams?.limit) || 10;
    const storeId = resolvedParams?.storeId || undefined;
    const status = resolvedParams?.status || undefined;
    const category = resolvedParams?.category || undefined;
    const priority = resolvedParams?.priority || undefined;

    let initialData = { data: [], pagination: { totalItems: 0, totalPages: 1 } };

    const session = await auth();

    try {
        const params = new URLSearchParams([
            ["page", page.toString()],
            ["limit", limit.toString()],
        ]);
        if (storeId) params.set("store", storeId);
        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (priority) params.set("priority", priority);

        const res = await fetchApi(`/api/incidents?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : "",
            },
        });

        if (res.ok) {
            const data = await res.json();
            initialData = data.body || initialData;
        } else {
            console.error("Failed to fetch incidents", res.status);
        }
    } catch (error) {
        console.error("Error fetching incidents:", error);
    }

    return (
        <div className="flex flex-col gap-6 w-full relative z-10 m-auto mt-0 max-w-7xl h-full p-6">
            <div className="flex items-center justify-between">
                <div>
                    <Title>Buzón de Incidencias</Title>
                    <Subtitle>Gestiona y reporta problemas dentro de la tienda.</Subtitle>
                </div>

                <Button asChild className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 shadow-[0_0_15px_rgba(255,107,0,0.15)] transition-all">
                    <Link href="/store/incidents/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Reportar Incidencia
                    </Link>
                </Button>
            </div>

            <div className="bg-sidebar/50 backdrop-blur-xl border border-white/10 rounded-2xl w-full flex flex-col p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <DataTable
                    defaultData={initialData.data}
                    pagination={initialData.pagination}
                />
            </div>
        </div>
    );
}
