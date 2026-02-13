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
    <>
      <CustomBreadcrumb links={links} />

      <Title>Actividades</Title>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Search className="sm:max-w-md" placeholder="Buscar por nombre" />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/store/activities/job-roles/new" scroll={false}>
            <Plus /> Nuevo rol de trabajo
          </Link>
        </Button>
      </div>

      {jobRoles.length ? (
        <>
          <ul className="flex flex-col gap-4">
            {jobRoles.map((jobRole) => (
              <li key={jobRole.id}>
                <JobRoleCard jobRole={jobRole} />
              </li>
            ))}
          </ul>

          <CustomPagination className="sm:justify-end" totalPages={pagination.lastPage} />
        </>
      ) : (
        <NoResults description="No se han encontrado roles de trabajo." />
      )}
    </>
  );
}
