import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole } from "@/utils";
import { areaDto, paginationDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function rowsAdapter(areas) {
  return areas.map(({ id, name, code, manager }) => ({
    id,
    name,
    code,
    manager: manager ? manager.shortFullName : "Sin asignar",
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

  const res = await fetchApi(`/area?page=${currentPage}&name=${q}&store=${session.store.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener las áreas de trabajo. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data },
  } = json;
  const areas = data.map((area) => areaDto(area));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: session.store.code, href: "/" }, { label: "Áreas" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <Title>Áreas</Title>

      <Tabs value="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger data-state="active">General</TabsTrigger>
          <TabsTrigger asChild>
            <Link href="/store/areas/user-assignment">Asignar empleados</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <section>
            <DataTable
              columns={columns}
              data={rowsAdapter(areas)}
              pagination={{ pageSize: 10, totalPages: pagination.lastPage }}
            />
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
