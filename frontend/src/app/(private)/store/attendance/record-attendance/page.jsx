import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole, safeUrlDecode } from "@/utils";
import { ROLES } from "@/data/constants";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { RecordAttendance } from "./record-attendance";

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
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Asistencia</Title>
        <p className="text-sm text-muted-foreground">
          Ya puedes comenzar a registrar la asistencia de los empleados o consultar los registros
          previamente guardados.
        </p>
      </div>

      <Tabs value="record-attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger data-state="active">Registrar asistencia</TabsTrigger>
          <TabsTrigger asChild>
            <Link
              href={`/store/attendance/recorded-attendance?team=${queries.team}&shift=${queries.shift}&schedule=${queries.schedule}`}
            >
              Asistencia registrada
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="record-attendance">
          <RecordAttendance storeId={session.store.id} teamId={teamId} scheduleId={scheduleId} />
        </TabsContent>
      </Tabs>
    </>
  );
}
