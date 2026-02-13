import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils/user";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { CreateEmployeeForm } from "@/components/forms/create-employee";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || !session.store) {
    redirect("/");
  }

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Empleados", href: "/store/employees" },
    { label: "Nuevo empleado" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <CreateEmployeeForm />
    </>
  );
}
