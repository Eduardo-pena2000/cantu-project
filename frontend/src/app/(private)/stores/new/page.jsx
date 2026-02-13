import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils/user";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { CreateStoreForm } from "@/components/forms/create-store";

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
    { label: "Tiendas", href: "/stores" },
    { label: "Nueva tienda" },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <CreateStoreForm />
    </>
  );
}
