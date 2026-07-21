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

    // MOCK LOCAL DATA
    const body = {
      id: decodeId,
      name: "Sucursal Ficticia " + decodeId,
      code: "SUC-" + decodeId,
      is_active: true,
      timezone: "America/Mexico_City"
    };
    const store = storeDto(body);

    return (
        <div className="flex flex-col gap-6 animate-fade-in p-6 max-w-5xl mx-auto">
            <ChecklistClient store={store} />
        </div>
    );
}
