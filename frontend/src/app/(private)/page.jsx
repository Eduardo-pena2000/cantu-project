import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { formatDate, hasRole } from "@/utils";
import { activeScheduleDto, employeeAssignmentDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { DataTable } from "../_home/data-table";
import { columns } from "../_home/columns";

async function getActiveShift(storeId, accessToken) {
  const res = await fetchApi(`/shift/active?store=${storeId}`, {
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
    assignments: attendance.assignments,
  }));
}

export default async function Page() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  if (
    hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug]) &&
    session.store
  ) {
    const { date, schedule } = await getActiveShift(session.store.id, session.accessToken);
    const scheduleEmployees = await getScheduleEmployees(
      schedule?.id,
      session.store.id,
      session.accessToken
    );

    return (
      <>
        <header className="max-w-prose">
          <Title>Resumen de actividades</Title>
          <Subtitle>{session.store.name}</Subtitle>
          <p className="text-muted-foreground text-sm">{formatDate({ date })}</p>
        </header>

        {schedule ? (
          <DataTable columns={columns} data={rowsAdapter(scheduleEmployees)} />
        ) : (
          <div>¡No se encontró un turno activo en este momento!</div>
        )}
      </>
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
      <>
        <header className="max-w-prose">
          <Title>Resumen de actividades</Title>
          <Subtitle>{session.store.name}</Subtitle>
          <p className="text-muted-foreground text-sm">{formatDate({ date })}</p>
        </header>

        {schedule ? (
          <DataTable columns={columns} data={rowsAdapter(scheduleEmployees)} />
        ) : (
          <div>¡No se encontró un turno activo en este momento!</div>
        )}
      </>
    );
  }

  return (
    <>
      <header className="max-w-prose">
        <Title>Inicio</Title>
      </header>
    </>
  );
}
