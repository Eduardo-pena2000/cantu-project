import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { teamDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { EditTeamForm } from "@/components/forms/edit-team";

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

  const res = await fetchApi(`/team/${decodeId}`, {
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
        "Hubo un error al intentar obtener el equipo de trabajo. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const team = teamDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Equipos de trabajo", href: "/store/work-teams" },
    { label: team.code, href: `/store/work-teams/${safeUrlEncode(team.id)}` },
    { label: "Editar equipo de trabajo" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title className="max-w-prose truncate">{team.name}</Title>
        <p className="text-sm text-muted-foreground">
          Edita los detalles del equipo de trabajo y actualiza su turno asignado para ajustar su
          horario de operación.
        </p>
      </div>

      <EditTeamForm team={team} className="max-w-prose" />
    </>
  );
}
