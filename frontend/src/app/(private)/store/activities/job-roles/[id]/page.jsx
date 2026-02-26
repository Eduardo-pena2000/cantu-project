import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClipboardList, SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { formatDate, hasRole, safeUrlDecode } from "@/utils";
import { jobRoleDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DeleteJobRoleButton } from "@/app/(private)/store/activities/delete-job-role-button";
import { JobRoleActivities } from "@/app/(private)/store/activities/job-role-activities";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";

export default async function Page({ params }) {
  const { id } = await params;
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

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/job-role/${decodeId}`, {
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
        "Hubo un error al intentar obtener el rol de trabajo. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const jobRole = jobRoleDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Roles de trabajo", href: "/store/activities" },
    { label: jobRole.code },
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
            <Title className="max-w-prose text-3xl tracking-tight text-foreground/90">{jobRole.name}</Title>
          </div>
          <div className="flex gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
            <Button asChild size="icon" variant="ghost" className="hover:bg-background hover:shadow-sm transition-all rounded-lg">
              <Link href={`/store/activities/job-roles/${id}/edit`} className="cursor-pointer">
                <SquarePen className="size-4" />
              </Link>
            </Button>
            <DeleteJobRoleButton id={decodeId} redirectTo="/store/activities" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative z-10 w-full mt-2">
          {/* Left Column - Details */}
          <div className="space-y-6">
            <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
              <Subtitle className="text-sidebar-primary mb-4 text-lg">General</Subtitle>
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
                  <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                    Nombre
                  </span>
                  <div className="text-foreground font-medium text-lg text-right">{jobRole.name}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
                  <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                    Creación
                  </span>
                  <div className="text-foreground font-medium text-sm text-right">
                    {formatDate({ date: new Date(jobRole.createdAt) })}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Actividades */}
          <section className="h-fit space-y-6 bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
            <Subtitle className="flex items-center gap-2 text-sidebar-primary mb-6 text-lg">
              <ClipboardList className="size-5" /> Actividades
            </Subtitle>

            <JobRoleActivities jobRoleId={jobRole.id} />
          </section>
        </div>
      </div>
    </div>
  );
}
