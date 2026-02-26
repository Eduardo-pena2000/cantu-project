export async function getIncidentById({ id }) {
    const res = await fetch(`/api/incidents/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ocurrió un error al obtener la incidencia");
    }

    const { body } = await res.json();

    return body;
}
