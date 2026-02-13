import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasRole } from "@/utils";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssignUsers from "./assign-users";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || !session.store) {
    redirect("/");
  }

  const links = [{ label: session.store.code, href: "/" }, { label: "Equipos de trabajo" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <Title>Equipos de trabajo</Title>

      <Tabs value="user-assignment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger asChild>
            <Link href="/store/work-teams">General</Link>
          </TabsTrigger>
          <TabsTrigger data-state="active">
            <Link href="/store/work-teams/user-assignment">Asignar usuarios</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-assignment">
          <AssignUsers />
        </TabsContent>
      </Tabs>
    </>
  );
}
