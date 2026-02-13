import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { jobRoleDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { EditJobRoleForm } from "@/components/forms/edit-job-role";

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
    { label: jobRole.code, href: `/store/activities/job-roles/${safeUrlEncode(jobRole.id)}` },
    { label: "Editar rol de trabajo" },
  ];

  return (
    <main className="space-y-4">
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>{jobRole.name}</Title>
        <p className="text-sm text-muted-foreground">
          Actualiza la información del rol de trabajo para asegurar que refleje con claridad su
          propósito y las actividades que agrupa. Una correcta definición facilita la organización y
          gestión de las tareas.
        </p>
      </div>

      <EditJobRoleForm jobRole={jobRole} className="max-w-prose" />
    </main>
  );
}
