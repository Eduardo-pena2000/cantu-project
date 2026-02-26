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
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Glow Blob */}
      <div className="absolute top-[-5%] right-[-5%] -z-10 w-96 h-96 bg-sidebar-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <CustomBreadcrumb links={links} />

      <div className="w-full max-w-3xl space-y-8 mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
            <Title className="max-w-prose truncate text-3xl tracking-tight text-foreground/90">{shift.name}</Title>
          </div>
          <div className="flex gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
            <Button asChild size="icon" variant="ghost" className="hover:bg-background hover:shadow-sm transition-all rounded-lg">
              <Link href={`/store/shifts/${id}/edit`} className="cursor-pointer">
                <SquarePen className="size-4" />
              </Link>
            </Button>
            <DeleteButton id={decodeId} redirectTo="/store/shifts" />
          </div>
        </div>

        <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
          <Subtitle className="text-sidebar-primary mb-4 text-lg">General</Subtitle>
          <div className="grid">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                Nombre
              </span>
              <div className="text-foreground font-medium text-lg">{shift.name}</div>
            </div>
          </div>
        </section>

        <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
          <Subtitle className="flex items-center gap-2 text-sidebar-primary mb-6 text-lg">
            <AlarmClock className="size-5" /> Horario
          </Subtitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {SCHEDULES.map((SCHEDULE) => {
              const schedule = schedules[SCHEDULE.week_day];

              return (
                <div key={SCHEDULE.week_day} className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30 hover:border-sidebar-primary/30 transition-colors group">
                  <span className="text-sidebar-primary font-bold uppercase tracking-wider mb-3 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sidebar-primary/70 group-hover:bg-sidebar-primary transition-colors" />
                    {SCHEDULE.day}
                  </span>
                  {schedule ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid w-full items-center gap-1.5">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Inicio</Label>
                        <Input disabled type="time" defaultValue={schedule.startTime} className="bg-muted/40 border-border/40 font-mono font-medium shadow-inner h-9" />
                      </div>
                      <div className="grid w-full items-center gap-1.5">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Fin</Label>
                        <Input disabled type="time" defaultValue={schedule.endTime} className="bg-muted/40 border-border/40 font-mono font-medium shadow-inner h-9" />
                      </div>
                    </div>
                  ) : (
                    <Alert variant="warning" className="bg-orange-500/5 text-orange-600 dark:text-orange-400 border-orange-500/20 shadow-none py-3 h-full flex items-center">
                      <TriangleAlert className="size-4" />
                      <AlertTitle className="text-xs mb-0 ml-2 font-medium">Libre (Sin horario definido)</AlertTitle>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
