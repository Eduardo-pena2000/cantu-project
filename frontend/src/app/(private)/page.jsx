import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { fetchApi, AppError } from "@/lib";
import { formatDate, hasRole } from "@/utils";
import { activeScheduleDto, employeeAssignmentDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { DataTable } from "../_home/data-table";
import { columns } from "../_home/columns";

import { WelcomeHero } from "@/components/dashboard/welcome-hero";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { NavigationCards } from "@/components/dashboard/navigation-cards";
import { GlobalEmployeesDataTable } from "@/components/dashboard/global-employees-table";
import { userDto } from "@/dtos";


async function getActiveShift(storeId, accessToken) {
  const res = await fetchApi(`/shift/active?store=${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return { date: new Date(), schedule: null };
    }
    throw AppError.applicationError(
      "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."
    );
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

  if (!res.ok) {
    throw AppError.applicationError(
      "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const { body } = json;
  const scheduleEmployees = body.map((employee) => employeeAssignmentDto(employee));

  return scheduleEmployees;
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


export default async function Page() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  if (
    hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
    ]) &&
    session.store
  ) {
    const { date, schedule } = await getActiveShift(session.store.id, session.accessToken);
    const scheduleEmployees = await getScheduleEmployees(
      schedule?.id,
      session.store.id,
      session.accessToken
    );

    const storeUsersRes = await fetchApi(`/user?limit=100&store=${session.store.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
    });
    const storeUsersJson = await storeUsersRes.json();
    const storeEmployees = (storeUsersJson.body?.data || [])
      .map((user) => userDto(user))
      .filter((user) => !user.roles.some((r) => r.name === "Administrador" || r.name === "Supervisor"));

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <WelcomeHero session={session} />

        <header className="flex flex-col gap-1 border-t pt-6 mt-2">
          <Title>Resumen de actividades</Title>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Subtitle className="text-sidebar-primary">{session.store.name}</Subtitle>
            <span>•</span>
            <p className="text-sm">{formatDate({ date })}</p>
          </div>
        </header>

        {/* Quick Access Navigation */}
        <NavigationCards />

        {schedule ? (
          <>
            <StatsCards scheduleEmployees={rowsAdapter(scheduleEmployees)} />
            <DashboardCharts employees={rowsAdapter(scheduleEmployees)} />
            <DataTable columns={columns} data={rowsAdapter(scheduleEmployees)} />
          </>
        ) : (
          <div className="p-8 border rounded-xl bg-muted/20 text-center animate-slide-up">
            <p className="text-muted-foreground">¡No se encontró un turno activo en este momento!</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <header className="flex flex-col gap-2 border-t pt-8 mt-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Directorio de la Sucursal</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Vista general rápida de todos los empleados asignados a esta sucursal y sus respectivos equipos.</p>
          </header>
          <GlobalEmployeesDataTable data={storeEmployees} />
        </div>
      </div>
    );
  }

  if (
    hasRole(session, [ROLES.SHIFT_MANAGER.slug, ROLES.TEMPORARY_SHIFT_MANAGER.slug]) &&
    session.store
  ) {
    const { date, schedule } = await getActiveShift(session.store.id, session.accessToken);
    const scheduleEmployees = await getScheduleEmployees(
      schedule?.id,
      session.store.id,
      session.accessToken
    );

    const storeUsersRes = await fetchApi(`/user?limit=100&store=${session.store.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
    });
    const storeUsersJson = await storeUsersRes.json();
    const storeEmployees = (storeUsersJson.body?.data || [])
      .map((user) => userDto(user))
      .filter((user) => !user.roles.some((r) => r.name === "Administrador" || r.name === "Supervisor"));

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <WelcomeHero session={session} />

        <header className="flex flex-col gap-1 border-t pt-6 mt-2">
          <Title>Resumen de actividades</Title>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Subtitle className="text-sidebar-primary">{session.store.name}</Subtitle>
            <span>•</span>
            <p className="text-sm">{formatDate({ date })}</p>
          </div>
        </header>

        {/* Quick Access Navigation */}
        <NavigationCards />

        {schedule ? (
          <>
            <StatsCards scheduleEmployees={rowsAdapter(scheduleEmployees)} />
            <DashboardCharts employees={rowsAdapter(scheduleEmployees)} />
            <DataTable columns={columns} data={rowsAdapter(scheduleEmployees)} />
          </>
        ) : (
          <div className="p-8 border rounded-xl bg-muted/20 text-center animate-slide-up">
            <p className="text-muted-foreground">¡No se encontró un turno activo en este momento!</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <header className="flex flex-col gap-2 border-t pt-8 mt-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Directorio de la Sucursal</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Vista general rápida de todos los empleados asignados a esta sucursal y sus respectivos equipos.</p>
          </header>
          <GlobalEmployeesDataTable data={storeEmployees} />
        </div>
      </div>
    );
  }

  // If the user is an Admin or General Manager and does NOT have a specific store selected,
  // we show the global dashboard.
  if (hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug]) && !session.store) {
    const globalUsersRes = await fetchApi(`/user?limit=100`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
    });
    const globalUsersJson = await globalUsersRes.json();
    const globalEmployees = (globalUsersJson.body?.data || [])
      .map((user) => userDto(user))
      .filter((user) => !user.roles.some((r) => r.name === "Administrador" || r.name === "Supervisor"));

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <WelcomeHero session={session} />

        <div className="mt-6 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <header className="flex flex-col gap-2 border-t pt-8 mt-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Directorio General de Empleados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Vista general rápida de todos los empleados en la aplicación, qué sucursales y qué equipos tienen asignados.</p>
          </header>
          <GlobalEmployeesDataTable data={globalEmployees} />
        </div>
      </div>
    );
  }

  // Fallback for any other state
  return (
    <>
      <WelcomeHero session={session} />
    </>
  );
}
