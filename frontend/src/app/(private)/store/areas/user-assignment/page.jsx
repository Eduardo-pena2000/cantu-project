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

  const links = [{ label: session.store.code, href: "/" }, { label: "Áreas" }];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <CustomBreadcrumb links={links} />
        <Title>Áreas</Title>
      </div>

      <Tabs value="user-assignment" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/40 p-1 rounded-xl shadow-inner border border-border/50">
          <TabsTrigger value="general" asChild className="rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300">
            <Link href="/store/areas">General</Link>
          </TabsTrigger>
          <TabsTrigger value="user-assignment" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300">
            Asignar usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-assignment" className="m-0">
          <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <AssignUsers />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
