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
        <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
          {/* Glow Blob */}
          <div className="absolute top-[-5%] right-[-5%] -z-10 w-96 h-96 bg-sidebar-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <CustomBreadcrumb links={links} />

          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
            <Title className="max-w-prose truncate text-3xl tracking-tight text-foreground/90">Asistencia</Title>
          </div>

          <Card className="max-w-prose bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
            <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
              <CardTitle className="text-xl text-foreground/90">{schedule.shift.name}</CardTitle>
              <CardDescription className="font-medium flex items-center gap-2">
                <CalendarX2 className="size-4" />
                {formatDate({ date })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">
                    Día de la semana
                  </span>
                  <p className="capitalize font-medium text-foreground">{date.toLocaleString("es", { weekday: "long" })}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">Hora inicio</span>
                  <p className="font-mono text-foreground font-medium">{formatTime(schedule.startTime)}</p>
                </div>
                <div className="bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">Hora fin</span>
                  <p className="font-mono text-foreground font-medium">{formatTime(schedule.endTime)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col bg-muted/10 border-t border-border/40 pt-4">
              <Alert className="max-w-prose border border-orange-500/30 bg-orange-500/5 shadow-sm rounded-xl">
                <Handshake className="size-5 text-orange-500" />
                <AlertTitle className="text-orange-600 dark:text-orange-400">No hay equipo de trabajo asignado.</AlertTitle>
                <AlertDescription className="text-foreground/80 leading-relaxed mt-2">
                  Actualmente, no hay un equipo de trabajo asignado a este turno de trabajo. Por
                  favor, asegúrate de haber asignado un equipo de trabajo para el turno{" "}
                  <span className="font-semibold text-foreground">{schedule.shift.name}</span>, y así, continuar el registro de asistencia y asignar
                  actividades.
                </AlertDescription>
                <div className="col-start-2 mt-4">
                  <Button asChild className="w-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Link href="/store/work-teams">Gestionar equipos</Link>
                  </Button>
                </div>
              </Alert>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Decorative Glow Blob */}
      <div className="absolute top-[-5%] left-[-2%] -z-10 w-72 h-72 bg-sidebar-primary/20 rounded-full blur-[100px] opacity-70 animate-pulse pointer-events-none" />

      <div className="flex flex-col gap-2 relative">
        <CustomBreadcrumb links={links} />
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 max-w-prose">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
            <Title className="text-3xl tracking-tight text-foreground/90">Asistencia</Title>
          </div>
          <p className="text-sm text-foreground/70 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/30 backdrop-blur-sm max-w-xs leading-relaxed">
            Selecciona un turno activo para continuar el registro de asistencia y actividades.
          </p>
        </div>
      </div>

      <Card className="max-w-prose bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
        <CardHeader className="bg-muted/20 border-b border-border/40 pb-4">
          <CardTitle className="text-xl text-foreground/90">{schedule.shift.name}</CardTitle>
          <CardDescription className="font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse" />
            {formatDate({ date })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">Día de la semana</span>
              <p className="capitalize font-medium text-foreground">{date.toLocaleString("es", { weekday: "long" })}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">Hora inicio</span>
              <p className="font-mono text-foreground font-medium">{formatTime(schedule.startTime)}</p>
            </div>
            <div className="bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">Hora fin</span>
              <p className="font-mono text-foreground font-medium">{formatTime(schedule.endTime)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 border-t border-border/40 pt-4">
          <CardAction className="w-full">
            <Button asChild className="w-full shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 h-12 text-md rounded-xl">
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
    </div>
  );
}
