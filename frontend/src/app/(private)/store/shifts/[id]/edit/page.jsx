import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { shiftDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { EditShiftForm } from "@/components/forms/edit-shift";

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

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Turnos", href: "/store/shifts" },
    { label: shift.name, href: `/store/shifts/${safeUrlEncode(shift.id)}` },
    { label: "Editar turno" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title className="max-w-prose truncate">{shift.name}</Title>
        <p className="text-sm text-muted-foreground">
          Modifica los horarios y días de la semana en los que este turno estará activo. Puedes
          ajustar los horarios existentes, agregar o quitar días, y cambiar al encargado responsable
          de supervisarlo.
        </p>
      </div>

      <EditShiftForm shift={shift} className="max-w-prose" />
    </>
  );
}
