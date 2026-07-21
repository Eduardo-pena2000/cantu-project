import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { fetchApi, AppError } from "@/lib";
import { hasRole, safeUrlDecode } from "@/utils";
import { storeDto, activeScheduleDto, employeeAssignmentDto } from "@/dtos";
import { ROLES } from "@/data/constants";

import { StoreSwitcher } from "@/components/store-switcher";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "../delete-button";
import { SupervisorStoreView } from "@/components/dashboard/supervisor-store-view";
import { AdminStoreView } from "@/components/dashboard/admin-store-view";

// Helper functions for Supervisor Data
async function getActiveShift(storeId, accessToken) {
  try {
    const res = await fetchApi(`/user/assistance/schedule/${storeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return { date: new Date(), schedule: null };
    const json = await res.json();
    const data = json.body;
    if (data && data.schedule) {
      return { date: data.date || new Date(), schedule: data.schedule };
    }
    return { date: new Date(), schedule: null };
  } catch (error) {
    return { date: new Date(), schedule: null };
  }
}

async function getScheduleEmployees(scheduleId, storeId, accessToken) {
  if (!scheduleId || !storeId) return [];
  try {
    const res = await fetchApi(`/user/activities/schedule/${scheduleId}/store/${storeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.body || [];
  } catch (error) {
    return [];
  }
}

function rowsAdapter(scheduleEmployees) {
  return scheduleEmployees.map(({ id, image, avatar_url, shortFullName, names, last_names, email, attendance }) => ({
    id,
    image: image || avatar_url || null,
    shortFullName: shortFullName || `${names || ""} ${last_names || ""}`.trim(),
    email,
    completed: attendance?.completed ?? 0,
    pending: attendance?.pending ?? 0,
    late: attendance?.late ?? 0,
    score: attendance?.score ?? 0,
    overallStatus: attendance?.overallStatus ?? "PENDING",
    assignments: attendance?.assignments ?? [],
  }));
}

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Allow Supervisor
  const isSupervisor = hasRole(session, ROLES.SUPERVISOR.slug);

  if (
    !hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SUPERVISOR.slug
    ]) ||
    (session.store && !isSupervisor)
  ) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  // Fetch Store Details from real API
  let store;
  try {
    const res = await fetchApi(`/store/${decodeId}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!res.ok) return notFound();
    const json = await res.json();
    store = storeDto(json.body);
  } catch (error) {
    return notFound();
  }

  // *** SUPERVISOR VIEW LOGIC ***
  if (hasRole(session, ROLES.SUPERVISOR.slug) && !hasRole(session, ROLES.ADMIN.slug)) {
    const { date, schedule } = await getActiveShift(store.id, session.accessToken);
    const scheduleEmployees = await getScheduleEmployees(
      schedule?.id,
      store.id,
      session.accessToken
    );
    const employeesData = rowsAdapter(scheduleEmployees || []);

    return (
      <SupervisorStoreView
        session={session}
        store={store}
        schedule={schedule}
        scheduleEmployees={scheduleEmployees}
        employeesData={employeesData}
      />
    );
  }

  // *** ADMIN VIEW ***
  const actions = (
    <div className="absolute right-4 -bottom-5 flex items-center gap-2">
      <StoreSwitcher 
         sessionStore={{ id: store.id, name: store.name, code: store.code }}
         className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center gap-2 px-6 py-5 rounded-full font-bold transition-all"
         variant="default"
         size="default"
      >
        Gestionar Tienda
      </StoreSwitcher>
      <Button asChild size="icon" variant="outline" className="rounded-full size-10 shadow-sm border-2">
        <Link href={`/stores/${id}/edit`} className="cursor-default">
          <SquarePen />
        </Link>
      </Button>
      <DeleteButton id={decodeId} redirectTo="/stores" />
    </div>
  );

  return <AdminStoreView store={store} actions={actions} />;
}

