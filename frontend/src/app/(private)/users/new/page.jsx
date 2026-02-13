import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils/user";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { CreateUserForm } from "@/components/forms/create-user";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || session.store) {
    redirect("/");
  }

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Usuarios", href: "/users" },
    { label: "Nuevo usuario" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <CreateUserForm />
    </>
  );
}
