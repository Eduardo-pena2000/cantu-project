import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole, safeUrlDecode } from "@/utils";
import { ROLES } from "@/data/constants";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { RecordedAttendance } from "./recorded-attendance";

export default async function Page({ searchParams }) {
  const queries = await searchParams;
  const session = await auth();

  const teamId = Number(safeUrlDecode(queries?.team));
  const shiftId = Number(safeUrlDecode(queries?.shift));
  const scheduleId = Number(safeUrlDecode(queries?.schedule));

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

  if (!teamId || !shiftId || !scheduleId) {
    redirect("/store/attendance");
  }

  if (isNaN(teamId) || isNaN(shiftId) || isNaN(scheduleId)) {
    redirect("/store/attendance");
  }

  const links = [{ label: session.store.code, href: "/" }, { label: "Asistencia" }];

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Glow Blob */}
      <div className="absolute top-[-5%] left-[-2%] -z-10 w-80 h-80 bg-sidebar-primary/20 rounded-full blur-[100px] opacity-70 animate-pulse pointer-events-none" />

      <CustomBreadcrumb links={links} />

      <div className="flex flex-col gap-2 relative">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="text-3xl tracking-tight text-foreground/90">Asistencia</Title>
        </div>
        <p className="text-sm text-foreground/70 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/30 backdrop-blur-sm max-w-lg leading-relaxed mt-2">
          Ya puedes comenzar a registrar la asistencia de los empleados o consultar los registros
          previamente guardados.
        </p>
      </div>

      <Tabs value="recorded-attendance" className="space-y-6 w-full relative z-10">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-background/60 p-1.5 rounded-xl shadow-sm border border-border/60 backdrop-blur-md">
          <TabsTrigger asChild value="record" className="rounded-lg py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 font-medium text-center">
            <Link
              href={`/store/attendance/record-attendance?team=${queries.team}&shift=${queries.shift}&schedule=${queries.schedule}`}
              className="w-full inline-block"
            >
              Registrar asistencia
            </Link>
          </TabsTrigger>
          <TabsTrigger value="recorded-attendance" data-state="active" className="rounded-lg py-2 data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground data-[state=active]:shadow-md transition-all duration-300 font-medium">Asistencia registrada</TabsTrigger>
        </TabsList>
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
          <TabsContent value="recorded-attendance" className="mt-0 outline-none">
            <RecordedAttendance scheduleId={scheduleId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
