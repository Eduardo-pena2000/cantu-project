import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { auth } from "@/auth";
import { hasRole } from "@/utils";
import { AppError, fetchApi } from "@/lib";
import { jobRoleDto, paginationDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search";
import { NoResults } from "@/components/no-results";
import { JobRoleCard } from "./job-role-card";
import { CustomPagination } from "@/components/pagination";

export default async function Page({ searchParams }) {
  const queries = await searchParams;
  const session = await auth();

  const q = queries?.q ?? "";
  const currentPage = Number(queries?.page ?? 1);

  if (!session) {
    redirect("/login");
  }

  if (
    !session.store ||
    !hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SHIFT_MANAGER.slug,
      ROLES.TEMPORARY_SHIFT_MANAGER.slug,
    ])
  ) {
    redirect("/");
  }

  const res = await fetchApi(`/job-role?page=${currentPage}&name=${q}&store=${session.store.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener los roles de trabajo. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data },
  } = json;
  const jobRoles = data.map((jobRole) => jobRoleDto(jobRole));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: session.store.code, href: "/" }, { label: "Actividades" }];

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Decorative Glow Blob */}
      <div className="absolute top-[-5%] left-[-2%] -z-10 w-72 h-72 bg-sidebar-primary/20 rounded-full blur-[100px] opacity-70 animate-pulse pointer-events-none" />

      <div className="flex flex-col gap-2 relative">
        <CustomBreadcrumb links={links} />
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="text-3xl tracking-tight text-foreground/90">Actividades</Title>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/80 p-5 rounded-2xl border border-border/60 shadow-lg shadow-black/5 backdrop-blur-xl relative overflow-hidden z-10 w-full mt-2">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sidebar-primary/50 to-transparent" />

        <div className="relative w-full sm:max-w-md">
          <Search className="w-full bg-background/50 shadow-inner border-border/80 focus-within:ring-2 focus-within:ring-sidebar-primary/20 transition-all rounded-lg" placeholder="Buscar por nombre..." />
        </div>
        <Button asChild className="w-full sm:w-auto shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-xl px-6">
          <Link href="/store/activities/job-roles/new" scroll={false}>
            <Plus className="mr-2 size-4" /> Nuevo rol de trabajo
          </Link>
        </Button>
      </div>

      {jobRoles.length ? (
        <div className="relative z-10">
          <ul className="grid min-[1024px]:grid-cols-2 gap-6">
            {jobRoles.map((jobRole) => (
              <li key={jobRole.id} className="h-full">
                <JobRoleCard jobRole={jobRole} />
              </li>
            ))}
          </ul>

          <div className="mt-8 bg-card/60 rounded-xl backdrop-blur-sm border border-border/40 p-2 shadow-sm">
            <CustomPagination className="sm:justify-end" totalPages={pagination.lastPage} />
          </div>
        </div>
      ) : (
        <div className="relative z-10 bg-card/60 rounded-2xl backdrop-blur-xl border border-border/50 shadow-sm p-8">
          <NoResults description="No se han encontrado roles de trabajo." />
        </div>
      )}
    </div>
  );
}
