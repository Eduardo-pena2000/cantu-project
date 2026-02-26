import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { hasRole } from "@/utils";
import { paginationDto, teamDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function rowsAdapter(teams) {
  return teams.map(({ id, name, code, shift, manager, isActive }) => ({
    id,
    name,
    code,
    shift: shift.name,
    manager: manager ? manager.shortFullName : "Sin asignar",
    status: isActive ? "Activo" : "Archivado",
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

  const res = await fetchApi(`/team?page=${currentPage}&name=${q}&store=${session.store.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener los equipos de trabajo. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data, total_active_teams },
  } = json;
  const teams = data.map((team) => teamDto(team));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: session.store.code, href: "/" }, { label: "Equipos de trabajo" }];

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Decorative Glow Blob */}
      <div className="absolute top-[-5%] left-[-2%] -z-10 w-72 h-72 bg-sidebar-primary/20 rounded-full blur-[100px] opacity-70 animate-pulse pointer-events-none" />

      <div className="flex flex-col gap-2 relative">
        <CustomBreadcrumb links={links} />
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="text-3xl tracking-tight text-foreground/90">Equipos de trabajo</Title>
        </div>
      </div>

      <Tabs value="general" className="space-y-6 relative z-10 w-full mt-2">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-background/60 p-1.5 rounded-xl shadow-sm border border-border/60 backdrop-blur-md">
          <TabsTrigger value="general" className="rounded-lg py-2 data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground data-[state=active]:shadow-md transition-all duration-300 font-medium">General</TabsTrigger>
          <TabsTrigger value="assignment" asChild className="rounded-lg py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 font-medium">
            <Link href="/store/work-teams/user-assignment">Asignar empleados</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <section>
            <DataTable
              columns={columns}
              data={rowsAdapter(teams)}
              pagination={{ pageSize: pagination.pageSize, totalPages: pagination.lastPage }}
              activeTeams={total_active_teams}
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
