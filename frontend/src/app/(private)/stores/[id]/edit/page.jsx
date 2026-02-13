import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { hasRole, safeUrlDecode, safeUrlEncode } from "@/utils";
import { storeDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { EditStoreForm } from "@/components/forms/edit-store";

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

  const res = await fetchApi(`/store/${decodeId}`, {
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
        "Hubo un error al intentar obtener la tienda. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const store = storeDto(body);

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Tiendas", href: "/stores" },
    { label: store.code, href: `/stores/${safeUrlEncode(store.id)}` },
    { label: "Editar tienda" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <EditStoreForm store={store} />
    </>
  );
}
