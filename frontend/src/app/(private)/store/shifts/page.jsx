import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole } from "@/utils";
import { shiftDto, paginationDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function rowsAdapter(shifts) {
  return shifts.map(({ id, name }) => ({
    id,
    name,
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

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || !session.store) {
    redirect("/");
  }

  const res = await fetchApi(`/shift?page=${currentPage}&name=${q}&store=${session.store.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener los turnos de trabajo. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data },
  } = json;
  const shifts = data.map((shift) => shiftDto(shift));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: session.store.code, href: "/" }, { label: "Turnos" }];

  return (
    <main className="h-full space-y-4 flex flex-col">
      <CustomBreadcrumb links={links} />

      <Title>Turnos</Title>

      <DataTable
        columns={columns}
        data={rowsAdapter(shifts)}
        pagination={{ pageSize: 10, totalPages: pagination.lastPage }}
      />
    </main>
  );
}
