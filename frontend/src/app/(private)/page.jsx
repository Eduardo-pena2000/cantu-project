import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { fetchApi, AppError } from "@/lib";
import { formatDate, hasRole } from "@/utils";
import { activeScheduleDto, employeeAssignmentDto } from "@/dtos";

import { ROLES } from "@/data/constants";
import { MENU_ITEMS } from "@/data/menu-items";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";

import { WelcomeHero } from "@/components/dashboard/welcome-hero";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { NavigationCards } from "@/components/dashboard/navigation-cards";
import { GlobalEmployeesDataTable } from "@/components/dashboard/global-employees-table";
import { EmployeePerformanceGrid } from "@/components/dashboard/employee-performance-grid";
import { userDto } from "@/dtos";
import { RealtimeRefresh } from "@/components/dashboard/realtime-refresh";

async function getActiveShift(storeId, accessToken) {
  // Mock local data so the dashboard charts are always visible
  return { 
    date: new Date(), 
    schedule: { id: 1, name: "Turno Matutino (Mock)" } 
  };
}

async function getScheduleEmployees(scheduleId, storeId, accessToken) {
  try {
    const res = await fetchApi(`/user?store=${storeId}&page=1&limit=50`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return [];
    
    const json = await res.json();
    const users = json?.body?.data || [];

    return users.map((user, index) => {
      // Mock local data for charts and tables to render properly without a backend
      const isExcellent = index % 5 === 0;
      const isWarning = index % 5 === 1;
      const isLate = index % 5 === 2;
      const isPending = index % 5 === 3;
      // index % 5 === 4 is 'NEW'
      
      const completedTasks = isExcellent ? 145 : isWarning ? 68 : isLate ? 23 : isPending ? 15 : 0;
      const pendingTasks = isExcellent ? 1 : isWarning ? 3 : isLate ? 5 : isPending ? 2 : 0;
      const lateTasks = isExcellent ? 2 : isWarning ? 12 : isLate ? 35 : isPending ? 8 : 0;
      
      const totalTasks = completedTasks + pendingTasks + lateTasks;
      const calculatedScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : null;
      
      const attendance = {
        completed: completedTasks,
        pending: pendingTasks,
        late: lateTasks,
        score: calculatedScore,
        overallStatus: isExcellent ? "EXCELLENT" : isWarning ? "WARNING" : isLate ? "LATE" : isPending ? "PENDING" : "NEW",
        assignments: isExcellent ? [
          { id: index + 100, assignedAt: "08:00:00", deadline: "10:00:00", isComplete: true, score: 95, isLate: false, status: "EXCELLENT", activity: { id: 1, name: "Revisar Inventario", description: "Revisión matutina." } }
        ] : isWarning ? [
          { id: index + 200, assignedAt: "09:00:00", deadline: "12:00:00", isComplete: false, score: null, isLate: true, status: "LATE", activity: { id: 2, name: "Limpieza", description: "Limpiar y acomodar." } }
        ] : isLate ? [
          { id: index + 300, assignedAt: "10:00:00", deadline: "11:00:00", isComplete: false, score: null, isLate: true, status: "LATE", activity: { id: 3, name: "Resurtir estantes", description: "Colocar producto nuevo." } }
        ] : isPending ? [
          { id: index + 400, assignedAt: "12:00:00", deadline: "16:00:00", isComplete: false, score: null, isLate: false, status: "PENDING", activity: { id: 4, name: "Acomodo general", description: "Organizar mercancía en bodega." } }
        ] : []
      };

      return {
        id: user.id,
        image: user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
        shortFullName: `${user.names?.split(' ')[0] || ''} ${user.last_names?.split(' ')[0] || ''}`.trim() || user.username,
        email: user.email,
        attendance
      };
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
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
        <RealtimeRefresh storeId={session.store.id} />
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
        {schedule ? (
          <NavigationCards type="general" />
        ) : (
          <div className="p-8 border rounded-xl bg-muted/20 text-center animate-slide-up mt-6">
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
