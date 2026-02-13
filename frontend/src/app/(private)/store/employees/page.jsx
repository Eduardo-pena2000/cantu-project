import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { getUserFullName, hasRole } from "@/utils";
import { employeeDto, paginationDto } from "@/dtos";
import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function rowsAdapter(employees) {
  return employees.map(({ id, image, names, lastNames, username, email, phone, isActive }) => ({
    id,
    image: image ?? "/user-round.svg",
    fullname: getUserFullName(names, lastNames),
    username: username,
    email,
    phone,
  }));
}

export default async function Page({ searchParams }) {
  const queries = await searchParams;
  const session = await auth();

  const q = queries?.q ?? "";
  const currentPage = Number(queries?.page ?? 1);

  if (!session) {
    redirect("/login");
  }

  if (
    !hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug]) ||
    !session.store
  ) {
    redirect("/");
  }

  const res = await fetchApi(
    `/user?page=${currentPage}&name=${q}&store=${session.store.id}&role=${ROLES.SHIFT_MANAGER.id}&role=${ROLES.TEMPORARY_SHIFT_MANAGER.id}&role=${ROLES.EMPLOYEE.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener los empleados. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data },
  } = json;
  const employees = data.map((employee) => employeeDto(employee));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: session.store.code, href: "/" }, { label: "Empleados" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <Title>Empleados</Title>

      <DataTable
        columns={columns}
        data={rowsAdapter(employees)}
        pagination={{ pageSize: 10, totalPages: pagination.lastPage }}
      />
    </>
  );
}
