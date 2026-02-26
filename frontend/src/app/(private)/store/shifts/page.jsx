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
    <main className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Decorative Glow Blob */}
      <div className="absolute top-[-5%] left-[-2%] -z-10 w-72 h-72 bg-sidebar-primary/20 rounded-full blur-[100px] opacity-70 animate-pulse pointer-events-none" />

      <div className="flex flex-col gap-2 relative">
        <CustomBreadcrumb links={links} />
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="text-3xl tracking-tight text-foreground/90">Turnos</Title>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rowsAdapter(shifts)}
        pagination={{ pageSize: 10, totalPages: pagination.lastPage }}
      />
    </main>
  );
}
