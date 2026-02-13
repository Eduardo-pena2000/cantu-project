import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils/user";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { CreateAreaForm } from "@/components/forms/create-area";

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
    { label: "Áreas", href: "/store/areas" },
    { label: "Nueva área" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="max-w-prose flex flex-col gap-1.5">
        <Title>Nueva área</Title>
        <p className="text-sm text-muted-foreground">
          Completa los campos a continuación para registrar una nueva área de trabajo dentro de la
          tienda.
        </p>
      </div>

      <CreateAreaForm className="max-w-prose" />
    </>
  );
}
