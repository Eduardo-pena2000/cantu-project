import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils/user";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { CreateShiftForm } from "@/components/forms/create-shift";

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
    { label: "Turnos", href: "/store/shifts" },
    { label: "Nuevo turno" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Nuevo turno</Title>
        <p className="text-sm text-muted-foreground">
          Establece los horarios generales para este turno, indicando los días de la semana en los
          que estará activo y los horarios correspondientes. Además, asigna un encargado que será
          responsable de supervisar este turno.
        </p>
      </div>

      <CreateShiftForm className="max-w-prose" />
    </>
  );
}
