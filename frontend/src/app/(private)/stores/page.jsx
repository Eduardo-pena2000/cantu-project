import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole } from "@/utils";
import { paginationDto, storeDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({ searchParams }) {
  const queries = await searchParams;
  const session = await auth();

  const q = queries?.q ?? "";
  const currentPage = Number(queries?.page ?? 1);

  if (!session) {
    redirect("/login");
  }

  if (
    !hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SUPERVISOR.slug,
    ]) ||
    session.store
  ) {
    redirect("/");
  }

  const res = await fetchApi(`/store?page=${currentPage}&name=${q}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener las tiendas. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data },
  } = json;
  const stores = data.map((store) => storeDto(store));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: "Inicio", href: "/" }, { label: "Tiendas" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <Title>Tiendas</Title>

      <DataTable
        columns={columns}
        data={stores}
        pagination={{ pageSize: 10, totalPages: pagination.lastPage }}
      />
    </>
  );
}
