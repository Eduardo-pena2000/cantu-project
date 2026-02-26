import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { IncidentDetails } from "./incident-details";
import { notFound } from "next/navigation";

export default async function IncidentDetailsPage({ params }) {
    const { id } = await params;
    const session = await auth();

    let incident = null;

    try {
        const res = await fetchApi(`/api/incidents/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : "",
            },
        });

        if (res.ok) {
            const data = await res.json();
            incident = data.body;
        } else {
            console.error("Failed to fetch incident", res.status);
            notFound();
        }
    } catch (error) {
        console.error("Error fetching incident specifics:", error);
        notFound();
    }

    if (!incident) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 w-full relative z-10 m-auto mt-0 max-w-7xl h-full p-6">
            <div className="flex items-center justify-between">
                <div>
                    <Title>Detalles de la incidencia</Title>
                    <Subtitle>Revisa la información y actualiza el estado del reporte.</Subtitle>
                </div>
            </div>

            <IncidentDetails incident={incident} />
        </div>
    );
}
