import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils/user";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { CreateTeamForm } from "@/components/forms/create-team";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || !session.store) {
    redirect("/");
  }

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Equipos de trabajo", href: "/store/work-teams" },
    { label: "Nuevo equipo de trabajo" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Nuevo equipo de trabajo</Title>
        <p className="text-sm text-muted-foreground">
          Crea un nuevo equipo de trabajo asociándolo a uno de los turnos disponibles para definir
          su horario de operación.
        </p>
      </div>

      <CreateTeamForm className="max-w-prose" />
    </>
  );
}
