import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { activityDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { EditActivityForm } from "@/components/forms/edit-activity";

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

  const res = await fetchApi(`/activitie/${decodeId}`, {
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
        "Hubo un error al intentar obtener la actividad. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const activity = activityDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Actividades", href: "/store/activities" },
    { label: activity.name, href: `/store/activities/${safeUrlEncode(activity.id)}` },
    { label: "Editar actividad" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>{activity.name}</Title>
        <p className="text-sm text-muted-foreground">
          Actualiza los campos necesarios para modificar la actividad. Verifica que la información
          proporcionada sea precisa y esté actualizada para garantizar su correcto seguimiento y
          asignación.
        </p>
      </div>

      <EditActivityForm activity={activity} className="max-w-prose" />
    </>
  );
}
