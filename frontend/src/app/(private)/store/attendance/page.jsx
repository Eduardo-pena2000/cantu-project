import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarX2, Handshake } from "lucide-react";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { formatDate, formatTime, hasRole, safeUrlEncode } from "@/utils";
import { activeScheduleDto } from "@/dtos";
import { ROLES } from "@/data/constants";

import { Button } from "@/components/ui/button";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (
    !session.store ||
    !hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SHIFT_MANAGER.slug,
      ROLES.TEMPORARY_SHIFT_MANAGER.slug,
    ])
  ) {
    redirect("/");
  }

  const res = await fetchApi(`/shift/active?store=${session.store.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener el turno activo. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const { body } = json;
  const date = new Date();
  const schedule = activeScheduleDto(body);

  const links = [{ label: session.store.code, href: "/" }, { label: "Asistencia" }];

  if (schedule === null) {
    if (
      hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug])
    ) {
      return (
        <Alert className="max-w-prose">
          <CalendarX2 className="size-4" />
          <AlertTitle>No se encontraron turnos activos.</AlertTitle>
          <AlertDescription>
            Actualmente, no hay turnos activos disponibles. Por favor, asegúrate de haber asignado
            un turno válido para el día de hoy, y así, continuar el registro de asistencia y asignar
            actividades.
          </AlertDescription>
          <div className="col-start-2 mt-2 flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link href="/store/shifts">Gestionar turnos</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/store/work-teams">Gestionar equipos</Link>
            </Button>
          </div>
        </Alert>
      );
    }

    if (hasRole(session, [ROLES.SHIFT_MANAGER.slug, ROLES.TEMPORARY_SHIFT_MANAGER.slug])) {
      return (
        <Alert className="max-w-prose">
          <CalendarX2 className="size-4" />
          <AlertTitle>No se encontraron turnos activos.</AlertTitle>
          <AlertDescription>
            <p>
              Actualmente, no hay turnos activos disponibles. Por favor, asegúrate de que exista un
              turno válido para el día de hoy, y así, continuar el registro de asistencia y asignar
              actividades.
            </p>
            <p>
              En caso de que sea un error del sistema, comunícate con el área administrativa para su
              validación.
            </p>
          </AlertDescription>
        </Alert>
      );
    }
  }

  if (schedule.shift.team === null) {
    if (
      hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug])
    ) {
      return (
        <>
          <Card className="max-w-prose">
            <CardHeader>
              <CardTitle>{schedule.shift.name}</CardTitle>
              <CardDescription>{formatDate({ date })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm font-semibold">
                    Día de la semana
                  </span>
                  <p className="capitalize">{date.toLocaleString("es", { weekday: "long" })}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm font-semibold">Hora inicio</span>
                  <p>{formatTime(schedule.startTime)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm font-semibold">Hora fin</span>
                  <p>{formatTime(schedule.endTime)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col">
              <Alert className="max-w-prose p-0 border-none">
                <Handshake className="size-4" />
                <AlertTitle>No hay equipo de trabajo asignado.</AlertTitle>
                <AlertDescription>
                  Actualmente, no hay un equipo de trabajo asignado a este turno de trabajo. Por
                  favor, asegúrate de haber asignado un equipo de trabajo para el turno{" "}
                  {schedule.shift.name}, y así, continuar el registro de asistencia y asignar
                  actividades.
                </AlertDescription>
                <div className="col-start-2 mt-2">
                  <Button asChild className="w-full">
                    <Link href="/store/work-teams">Gestionar equipos</Link>
                  </Button>
                </div>
              </Alert>
            </CardFooter>
          </Card>
        </>
      );
    }
  }

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Asistencia</Title>
        <p className="text-sm text-muted-foreground">
          Para continuar, selecciona un turno activo. Esto te permitirá registrar la asistencia del
          equipo y asignar las actividades correspondientes.
        </p>
      </div>

      <Card className="max-w-prose">
        <CardHeader>
          <CardTitle>{schedule.shift.name}</CardTitle>
          <CardDescription>{formatDate({ date })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-sm font-semibold">Día de la semana</span>
              <p className="capitalize">{date.toLocaleString("es", { weekday: "long" })}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-sm font-semibold">Hora inicio</span>
              <p>{formatTime(schedule.startTime)}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-semibold">Hora fin</span>
              <p>{formatTime(schedule.endTime)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <CardAction className="w-full">
            <Button asChild className="w-full">
              <Link
                href={`/store/attendance/record-attendance?team=${safeUrlEncode(
                  schedule.shift.team.id
                )}&shift=${safeUrlEncode(schedule.shift.id)}&schedule=${safeUrlEncode(
                  schedule.id
                )}`}
              >
                Tomar asistencia
              </Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </>
  );
}
