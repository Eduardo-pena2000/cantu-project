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
  // Mock local data
  return { date: new Date(), schedule: { id: 1, name: "Turno Mock" } };
}

async function getScheduleEmployees(scheduleId, storeId, accessToken) {
  // Mock local data
  return [
    {
      id: 101,
      image: "https://i.pravatar.cc/150?u=1",
      shortFullName: "Empleado Uno",
      email: "emp1@example.com",
      attendance: { completed: 2, pending: 1, late: 0, score: 85, overallStatus: "GOOD", assignments: [] }
    }
  ];
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
  // MOCK LOCAL DATA
  const body = {
    id: decodeId,
    name: "Sucursal Ficticia " + decodeId,
    code: "SUC-" + decodeId,
    is_active: true,
    timezone: "America/Mexico_City"
  };
  const store = storeDto(body);

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
