import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils";

import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { CreateJobRoleForm } from "@/components/forms/create-job-role";

export default async function Page() {
  const session = await auth();

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

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Roles de trabajo", href: "/store/activities" },
    { label: "Nuevo rol de trabajo" },
  ];

  return (
    <main className="space-y-4">
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Nuevo rol de trabajo</Title>
        <p className="text-sm text-muted-foreground">
          Crea un nuevo rol de trabajo proporcionando un nombre representativo. Los roles de trabajo
          permiten agrupar actividades relacionadas bajo una misma categoría, facilitando su
          organización y gestión.
        </p>
      </div>

      <CreateJobRoleForm className="max-w-prose" />
    </main>
  );
}
