import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils";

import { ROLES } from "@/data/constants";

import { Report } from "@/app/(private)/reports/report";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug])) {
    redirect("/");
  }

  const links = [{ label: "Inicio", href: "/" }, { label: "Reportes" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <Title>Reportes</Title>

      <section>
        <p className="max-w-prose text-muted-foreground">
          Es necesario aplicar los filtros de búsqueda antes de visualizar la información
          disponible.
        </p>

        <Report />
      </section>
    </>
  );
}
