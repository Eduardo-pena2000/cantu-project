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
import { EmployeePerformanceGrid } from "@/components/dashboard/employee-performance-grid";
import { userDto } from "@/dtos";


async function getActiveShift(storeId, accessToken) {
  // Mock local data so the dashboard charts are always visible
  return { 
    date: new Date(), 
    schedule: { id: 1, name: "Turno Matutino (Mock)" } 
  };
}

async function getScheduleEmployees(scheduleId, storeId, accessToken) {
  // Mock local data for charts and tables to render properly without a backend
  return [
    {
      id: 1,
      image: "https://i.pravatar.cc/150?u=1",
      shortFullName: "Juan Pérez",
      email: "juan@cantu.com",
      attendance: { 
        completed: 5, pending: 0, late: 0, score: 95, overallStatus: "EXCELLENT", 
        assignments: [
          { id: 1, deadline: "10:00:00", isComplete: true, score: 95, isLate: false, status: "EXCELLENT", activity: { id: 1, name: "Revisar Inventario", description: "Revisión matutina." } }
        ] 
      }
    },
    {
      id: 2,
      image: "https://i.pravatar.cc/150?u=2",
      shortFullName: "Ana Gómez",
      email: "ana@cantu.com",
      attendance: { 
        completed: 3, pending: 1, late: 1, score: 80, overallStatus: "WARNING", 
        assignments: [
          { id: 2, deadline: "12:00:00", isComplete: false, score: null, isLate: true, status: "LATE", activity: { id: 2, name: "Limpieza de Pasillos", description: "Limpiar y acomodar." } }
        ] 
      }
    },
    {
      id: 3,
      image: "https://i.pravatar.cc/150?u=3",
      shortFullName: "Carlos López",
      email: "carlos@cantu.com",
      attendance: { completed: 2, pending: 2, late: 0, score: null, overallStatus: "WARNING", assignments: [] }
    },
    {
      id: 4,
      image: "https://i.pravatar.cc/150?u=4",
      shortFullName: "María Torres",
      email: "maria@cantu.com",
      attendance: { completed: 0, pending: 0, late: 4, score: 50, overallStatus: "LATE", assignments: [] }
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
            <div className="space-y-4 my-4">
                <div className="flex items-center gap-2">
                    <Title level={2} className="text-lg">Semáforo de Rendimiento</Title>
                    <span className="text-xs font-normal text-muted-foreground border px-2 py-0.5 rounded-full">En tiempo real</span>
                </div>
                <EmployeePerformanceGrid employees={rowsAdapter(scheduleEmployees)} />
            </div>
            <DashboardCharts employees={rowsAdapter(scheduleEmployees)} />
            <DataTable columns={columns} data={rowsAdapter(scheduleEmployees)} />
          </>
        ) : (
          <div className="p-8 border rounded-xl bg-muted/20 text-center animate-slide-up">
            <p className="text-muted-foreground">¡No se encontró un turno activo en este momento!</p>
          </div>
        )}
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
            <div className="space-y-4 my-4">
                <div className="flex items-center gap-2">
                    <Title level={2} className="text-lg">Semáforo de Rendimiento</Title>
                    <span className="text-xs font-normal text-muted-foreground border px-2 py-0.5 rounded-full">En tiempo real</span>
                </div>
                <EmployeePerformanceGrid employees={rowsAdapter(scheduleEmployees)} />
            </div>
            <DashboardCharts employees={rowsAdapter(scheduleEmployees)} />
            <DataTable columns={columns} data={rowsAdapter(scheduleEmployees)} />
          </>
        ) : (
          <div className="p-8 border rounded-xl bg-muted/20 text-center animate-slide-up">
            <p className="text-muted-foreground">¡No se encontró un turno activo en este momento!</p>
          </div>
        )}
      </div>
    );
  }

  // If the user is an Admin or General Manager and does NOT have a specific store selected,
  // we show the global dashboard.
  if (hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug]) && !session.store) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <WelcomeHero session={session} />
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
