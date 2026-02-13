import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlarmClock, SquarePen, TriangleAlert } from "lucide-react";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode } from "@/utils";
import { SCHEDULES } from "@/data/constants";
import { shiftDto, shiftSchedulesObjectDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "../delete-button";

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || !session.store) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/shift/${decodeId}`, {
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
        "Hubo un error al intentar obtener el turno. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const shift = shiftDto(body);
  const schedules = shiftSchedulesObjectDto(shift.schedules);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Turnos", href: "/store/shifts" },
    { label: shift.name },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div>
        <Title className="max-w-prose truncate">{shift.name}</Title>
        <div className="space-x-2">
          <Button asChild size="icon" variant="ghost">
            <Link href={`/store/shifts/${id}/edit`} className="cursor-default">
              <SquarePen />
            </Link>
          </Button>
          <DeleteButton id={decodeId} redirectTo="/store/shifts" />
        </div>
      </div>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>General</Subtitle>
        <div className="grid">
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <span>{shift.name}</span>
        </div>
      </section>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>
          <AlarmClock /> Horario
        </Subtitle>
        {SCHEDULES.map((SCHEDULE) => {
          const schedule = schedules[SCHEDULE.week_day];

          return (
            <div key={SCHEDULE.week_day} className="grid gap-1">
              <span className="text-muted-foreground text-sm font-semibold">{SCHEDULE.day}</span>
              {schedule ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full max-w-3xs items-center gap-1.5">
                    <Label className="text-muted-foreground">Hora inicio</Label>
                    <Input disabled type="time" defaultValue={schedule.startTime} />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className="text-muted-foreground">Hora fin</Label>
                    <Input disabled type="time" defaultValue={schedule.endTime} />
                  </div>
                </div>
              ) : (
                <Alert variant="warning">
                  <TriangleAlert />
                  <AlertTitle>No existe un horario definido para este día.</AlertTitle>
                </Alert>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
