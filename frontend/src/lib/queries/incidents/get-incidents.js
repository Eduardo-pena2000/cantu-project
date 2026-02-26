export async function getIncidents({ store, status, category, priority, page = 1, limit = 10 }) {
    const params = new URLSearchParams([
        ["page", page],
        ["limit", limit],
    ]);

    if (store) params.set("store", store);
    if (status) params.set("status", status);
    if (category) params.set("category", category);
    if (priority) params.set("priority", priority);

    const res = await fetch(`/api/incidents?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ocurrió un error al obtener las incidencias");
    }

    const { body } = await res.json();

    return body; // Assuming backend returns { data, pagination: { totalItems, totalPages... } }
}
