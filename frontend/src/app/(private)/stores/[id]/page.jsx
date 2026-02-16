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
  const res = await fetchApi(`/shift/active?store=${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return { date: new Date(), schedule: null };
  }

  const json = await res.json();
  const { body } = json;
  const date = new Date();
  const schedule = activeScheduleDto(body);

  return { date, schedule };
}

async function getScheduleEmployees(scheduleId, storeId, accessToken) {
  if (!scheduleId) return [];

  const res = await fetchApi(`/user/activities/schedule/${scheduleId}/store/${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const { body } = json;
  return body.map((employee) => employeeAssignmentDto(employee));
}

function rowsAdapter(scheduleEmployees) {
  return scheduleEmployees.map(({ id, image, shortFullName, email, attendance }) => ({
    id,
    image,
    shortFullName,
    email,
    completed: attendance.completed,
    pending: attendance.pending,
    late: attendance.late,
    score: attendance.score,
    overallStatus: attendance.overallStatus,
    assignments: attendance.assignments,
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

  // Fetch Store Details (Common)
  const res = await fetchApi(`/store/${decodeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    } else {
      throw AppError.applicationError(
        "Hubo un error al intentar obtener la tienda. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();
  const { body } = json;
  const store = storeDto(body);

  // *** SUPERVISOR VIEW LOGIC ***
  if (hasRole(session, ROLES.SUPERVISOR.slug)) {
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
    <div className="absolute right-0 bottom-0 space-x-2">
      <StoreSwitcher sessionStore={{ id: store.id, name: store.name, code: store.code }} />
      <Button asChild size="icon" variant="ghost">
        <Link href={`/stores/${id}/edit`} className="cursor-default">
          <SquarePen />
        </Link>
      </Button>
      <DeleteButton id={decodeId} redirectTo="/stores" />
    </div>
  );

  return <AdminStoreView store={store} actions={actions} />;
}
