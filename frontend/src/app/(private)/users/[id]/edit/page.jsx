import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { userDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { EditUserForm } from "@/components/forms/edit-user";

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || session.store) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/user/${decodeId}`, {
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
        "Hubo un error al intentar obtener el usuario. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const user = userDto(body);

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Usuarios", href: "/users" },
    { label: user.username, href: `/users/${safeUrlEncode(user.id)}` },
    { label: "Editar usuario" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <EditUserForm user={user} />
    </>
  );
}
