export async function createIncident({ data }) {
    const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ocurrió un error al reportar la incidencia.");
    }

    const { body } = await response.json();
    return body;
}
