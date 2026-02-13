import { redirect } from "next/navigation";
import { ImageOff, UserRound } from "lucide-react";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import {
  formatDate,
  formatTime,
  getActivityScore,
  getAssigmentStatus,
  hasRole,
  safeUrlDecode,
} from "@/utils";
import { assignmentDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RateActivity } from "@/app/(private)/assignment/rate/rate-activity";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  if (
    !hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SHIFT_MANAGER.slug,
      ROLES.TEMPORARY_SHIFT_MANAGER.slug,
    ]) ||
    !session.store
  ) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/activitie/assigned/${decodeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const { body } = json;
  const assignment = assignmentDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Calificar", href: "/" },
    { label: assignment.activity.name },
  ];

  if (hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug])) {
    return (
      <>
        <CustomBreadcrumb links={links} />

        <Title>Calificar actividad</Title>

        <section className="max-w-prose space-y-4">
          <Subtitle>General</Subtitle>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
            <span>{assignment.activity.name}</span>
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Descripción</span>
            <span>{assignment.activity.description}</span>
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Fecha límite</span>
            <div className="leading-tight grid">
              <span>{formatDate(new Date(assignment.date))}</span>
              <span>{formatTime(assignment.deadline)}</span>
            </div>
          </div>
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Estado de la actividad</Subtitle>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Estatus</span>
            <span>{getAssigmentStatus(assignment)}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground text-sm font-semibold">
              Calificación del encargado
            </span>
            {getActivityScore(assignment.shiftManagerScore)}
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">
              Observaciones del encargado
            </span>
            <p>{assignment.shiftManagerComment ?? "Sin observaciones."}</p>
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">
              Evidencia del encargado
            </span>
            {assignment.imageUrl ? (
              <div className="h-auto w-full overflow-hidden rounded-md">
                <img
                  src={assignment.imageUrl}
                  alt="Evidencia del cumplimiento de la actividad"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageOff />
                  </EmptyMedia>
                  <EmptyTitle>No hay evidencia</EmptyTitle>
                  <EmptyDescription>
                    Aún no existe evidencia fotográfica para el cumplimiento de esta actividad.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Calificación</Subtitle>
          {assignment.managerScore === null ? (
            <RateActivity assignmentId={assignment.id} isManager={true} />
          ) : (
            <>
              <div className="grid gap-1">{getActivityScore(assignment.managerScore)}</div>
              <div className="grid">
                <span className="text-muted-foreground text-sm font-semibold">Observaciones</span>
                <p>{assignment.managerComment ?? "Sin observaciones."}</p>
              </div>
            </>
          )}
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Asignado por</Subtitle>
          <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-2">
            <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
              <AvatarImage
                src={assignment.attendance.takenEmployee.image ?? "/user-round.svg"}
                className="size-10 shadow-sm shrink-0 object-cover aspect-square"
              />
              <AvatarFallback className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                <UserRound className="size-10" strokeWidth={1} />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{assignment.attendance.takenEmployee.shortFullName}</span>
              <span className="text-xs text-muted-foreground">
                {assignment.attendance.takenEmployee.email}
              </span>
            </div>
          </div>
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Asignado a</Subtitle>
          <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-2">
            <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
              <AvatarImage
                src={assignment.attendance.employee.image ?? "/user-round.svg"}
                className="size-10 shadow-sm shrink-0 object-cover aspect-square"
              />
              <AvatarFallback className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                <UserRound className="size-10" strokeWidth={1} />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{assignment.attendance.employee.shortFullName}</span>
              <span className="text-xs text-muted-foreground">
                {assignment.attendance.employee.email}
              </span>
            </div>
          </div>
          {assignment.attendance.imageUrl ? (
            <div className="h-auto w-full overflow-hidden rounded-md">
              <img
                src={assignment.attendance.imageUrl}
                alt={`Asistencia de ${assignment.attendance.employee.shortFullName}`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageOff />
                </EmptyMedia>
                <EmptyTitle>No hay evidencia</EmptyTitle>
                <EmptyDescription>
                  Aún no existe evidencia fotográfica para la asistencia de{" "}
                  {assignment.attendance.employee.shortFullName}.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>
      </>
    );
  }

  if (hasRole(session, [ROLES.SHIFT_MANAGER.slug, ROLES.TEMPORARY_SHIFT_MANAGER.slug])) {
    return (
      <>
        <CustomBreadcrumb links={links} />

        <Title>Calificar actividad</Title>

        <section className="max-w-prose space-y-4">
          <Subtitle>General</Subtitle>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
            <span>{assignment.activity.name}</span>
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Descripción</span>
            <span>{assignment.activity.description}</span>
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Fecha límite</span>
            <div className="leading-tight grid">
              <span>{formatDate(new Date(assignment.date))}</span>
              <span>{formatTime(assignment.deadline)}</span>
            </div>
          </div>
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Estado de la actividad</Subtitle>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">Estatus</span>
            <span>{getAssigmentStatus(assignment)}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground text-sm font-semibold">
              Calificación del gerente
            </span>
            {getActivityScore(assignment.managerScore)}
          </div>
          <div className="grid">
            <span className="text-muted-foreground text-sm font-semibold">
              Observaciones del gerente
            </span>
            <p>{assignment.managerComment ?? "Sin observaciones."}</p>
          </div>
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Calificación</Subtitle>
          {assignment.managerScore === null ? (
            <RateActivity assignmentId={assignment.id} isManager={false} />
          ) : (
            <>
              <div className="grid gap-1">{getActivityScore(assignment.shiftManagerScore)}</div>
              <div className="grid">
                <span className="text-muted-foreground text-sm font-semibold">Observaciones</span>
                <p>{assignment.shiftManagerComment ?? "Sin observaciones."}</p>
              </div>
            </>
          )}
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Asignado por</Subtitle>
          <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-2">
            <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
              <AvatarImage
                src={assignment.attendance.takenEmployee.image ?? "/user-round.svg"}
                className="size-10 shadow-sm shrink-0 object-cover aspect-square"
              />
              <AvatarFallback className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                <UserRound className="size-10" strokeWidth={1} />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{assignment.attendance.takenEmployee.shortFullName}</span>
              <span className="text-xs text-muted-foreground">
                {assignment.attendance.takenEmployee.email}
              </span>
            </div>
          </div>
        </section>

        <Separator />

        <section className="max-w-prose space-y-4">
          <Subtitle>Asignado a</Subtitle>
          <div className="leading-none grid grid-cols-[40px_1fr] items-center gap-x-2">
            <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
              <AvatarImage
                src={assignment.attendance.employee.image ?? "/user-round.svg"}
                className="size-10 shadow-sm shrink-0 object-cover aspect-square"
              />
              <AvatarFallback className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                <UserRound className="size-10" strokeWidth={1} />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{assignment.attendance.employee.shortFullName}</span>
              <span className="text-xs text-muted-foreground">
                {assignment.attendance.employee.email}
              </span>
            </div>
          </div>
          {assignment.attendance.imageUrl ? (
            <div className="h-auto w-full overflow-hidden rounded-md">
              <img
                src={assignment.attendance.imageUrl}
                alt={`Asistencia de ${assignment.attendance.employee.shortFullName}`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageOff />
                </EmptyMedia>
                <EmptyTitle>No hay evidencia</EmptyTitle>
                <EmptyDescription>
                  Aún no existe evidencia fotográfica para la asistencia de{" "}
                  {assignment.attendance.employee.shortFullName}.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>
      </>
    );
  }
}
