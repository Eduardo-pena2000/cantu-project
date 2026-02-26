export async function updateIncidentStatus({ id, data }) {
    const response = await fetch(`/api/incidents/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ocurrió un error al actualizar el estatus de la incidencia.");
    }

    const { body } = await response.json();
    return body;
}
