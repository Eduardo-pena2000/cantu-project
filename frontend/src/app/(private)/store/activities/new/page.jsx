import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode } from "@/utils";
import { jobRoleDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { CreateActivityForm } from "@/components/forms/create-activity";

export default async function Page({ searchParams }) {
  const queries = await searchParams;
  const session = await auth();

  const jobRoleId = safeUrlDecode(queries["job-role"]);

  if (!jobRoleId || isNaN(Number(jobRoleId))) {
    redirect("/store/activities");
  }

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

  const res = await fetchApi(`/job-role/${jobRoleId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      redirect("/store/activities");
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
    { label: "Actividades", href: "/store/activities" },
    { label: "Nueva actividad" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Nueva actividad</Title>
        <p className="text-sm text-muted-foreground">
          Completa los siguientes campos para registrar una nueva actividad. Asegúrate de
          proporcionar información precisa y detallada para facilitar su seguimiento y correcta
          asignación.
        </p>
      </div>

      <div className="max-w-prose leading-tight">
        <span className="text-sm text-muted-foreground font-semibold">Rol de trabajo</span>
        <p>{jobRole.name}</p>
        <p className="text-sm">{jobRole.code}</p>
      </div>

      <CreateActivityForm className="max-w-prose" jobRoleId={jobRole.id} />
    </>
  );
}
