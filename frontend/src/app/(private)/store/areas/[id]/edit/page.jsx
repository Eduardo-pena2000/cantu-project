import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { areaDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { EditAreaForm } from "@/components/forms/edit-area";

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

  const res = await fetchApi(`/area/${decodeId}`, {
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
        "Hubo un error al intentar obtener el área de trabajo. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const area = areaDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Áreas", href: "/store/areas" },
    { label: area.name, href: `/store/areas/${safeUrlEncode(area.id)}` },
    { label: "Editar área" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title className="max-w-prose truncate">{area.name}</Title>
        <p className="text-sm text-muted-foreground">
          Actualiza la información del área de trabajo según sea necesario. Asegúrate de que los
          datos sean precisos y reflejen correctamente los cambios que deseas aplicar.
        </p>
      </div>

      <EditAreaForm area={area} className="max-w-prose" />
    </>
  );
}
