import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasRole, safeUrlDecode } from "@/utils";
import { ROLES } from "@/data/constants";
import { fetchApi } from "@/lib";
import { storeDto } from "@/dtos";

import { ChecklistClient } from "./checklist-client";

export default async function ChecklistPage({ params }) {
    const { id } = await params;
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Allow only Supervisors (or admins for testing if needed)
    if (!hasRole(session, [ROLES.SUPERVISOR.slug, ROLES.ADMIN.slug])) {
        redirect("/");
    }

    const decodeId = Number(safeUrlDecode(id));

    // Fetch real store data
    let store;
    try {
        const res = await fetchApi(`/store/${decodeId}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        if (!res.ok) redirect("/");
        const json = await res.json();
        store = storeDto(json.body);
    } catch (error) {
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-6 animate-fade-in p-6 max-w-5xl mx-auto">
            <ChecklistClient store={store} />
        </div>
    );
}
