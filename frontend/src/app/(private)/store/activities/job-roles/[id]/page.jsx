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
    <>
      <CustomBreadcrumb links={links} />

      <div>
        <Title className="max-w-prose">{jobRole.name}</Title>
        <div className="space-x-2">
          <Button asChild size="icon" variant="ghost">
            <Link href={`/store/activities/job-roles/${id}/edit`} className="cursor-default">
              <SquarePen />
            </Link>
          </Button>
          <DeleteJobRoleButton id={decodeId} redirectTo="/store/activities" />
        </div>
      </div>

      <section className="max-w-prose">
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <p>{jobRole.name}</p>
          <p className="text-muted-foreground text-sm">
            Creado el {formatDate({ date: new Date(jobRole.createdAt) })}
          </p>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <Subtitle>
          <ClipboardList /> Actividades
        </Subtitle>

        <JobRoleActivities jobRoleId={jobRole.id} />
      </section>
    </>
  );
}
