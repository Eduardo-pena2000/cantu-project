import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { hasRole, safeUrlDecode } from "@/utils";
import { areaDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, UsersRound } from "lucide-react";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { DeleteButton } from "@/app/(private)/store/areas/delete-button";

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (
    !session.store ||
    !hasRole(session, [ROLES.ADMIN.slug, ROLES.GENERAL_MANAGER.slug, ROLES.STORE_MANAGER.slug])
  ) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/area/${decodeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    } else {
      throw AppError.applicationError(
        "Hubo un error al intentar obtener el área de trabajo. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const area = areaDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Áreas", href: "/store/areas" },
    { label: area.name },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Glow Blob */}
      <div className="absolute top-[-5%] right-[-5%] -z-10 w-96 h-96 bg-sidebar-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <CustomBreadcrumb links={links} />

      <div className="flex flex-col min-[480px]:flex-row justify-between items-start min-[480px]:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="max-w-prose text-3xl tracking-tight text-foreground/90">{area.name}</Title>
        </div>
        <div className="flex gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
          <Button asChild size="icon" variant="ghost" className="hover:bg-background hover:shadow-sm transition-all rounded-lg">
            <Link href={`/store/areas/${id}/edit`} className="cursor-pointer">
              <SquarePen className="size-4" />
            </Link>
          </Button>
          <DeleteButton id={decodeId} redirectTo="/store/areas" />
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="grid md:grid-cols-2 gap-6 relative z-10 w-full mt-2">
        {/* General Info Card */}
        <section className="space-y-6 bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
          <Subtitle className="text-sidebar-primary">Información General</Subtitle>
          <div className="grid gap-6">
            <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1">Nombre</span>
              <span className="text-foreground font-medium text-lg">{area.name}</span>
            </div>
            <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1">Código</span>
              <span className="text-foreground font-medium font-mono bg-muted/40 px-2 py-0.5 rounded w-fit">{area.code}</span>
            </div>
            <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-3">Encargado del Área</span>
              {area.manager ? (
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 shadow-sm shrink-0 object-cover aspect-square ring-2 ring-sidebar-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage
                      src={area.manager.image ?? "/user-round.svg"}
                      className="size-14 shadow-sm shrink-0 object-cover aspect-square"
                      alt={`Imagen de ${area.manager.shortFullName}`}
                    />
                    <AvatarFallback className="size-14 bg-muted/50 text-muted-foreground">
                      <UserRound size={24} strokeWidth={1.5} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{area.manager.shortFullName}</span>
                    <p className="text-sm text-sidebar-primary font-medium">#{area.manager.username}</p>
                    <p className="text-sm text-muted-foreground">{area.manager.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground flex items-center gap-2 italic">
                  <UserRound className="size-4 opacity-50" /> Sin encargado asignado
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Assigned Employees Card */}
        <section className="space-y-6 bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
          <Subtitle className="flex items-center gap-2">
            <UsersRound className="size-5 text-sidebar-primary" />
            Empleados Asignados ({area.employees?.length ?? 0})
          </Subtitle>

          <div className="bg-background/40 rounded-xl border border-border/40 overflow-hidden">
            {area.employees && area.employees.length > 0 ? (
              <ul className="divide-y divide-border/30 max-h-[400px] overflow-y-auto">
                {area.employees.map((employee) => (
                  <li key={employee.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
                    <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                      <AvatarImage
                        src={employee.image ?? "/user-round.svg"}
                        className="size-10 shadow-sm shrink-0 object-cover aspect-square group-hover:scale-105 transition-transform"
                      />
                      <AvatarFallback className="size-10 bg-muted text-muted-foreground">
                        <UserRound className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{employee.fullName}</span>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/10 h-[200px]">
                <UsersRound className="size-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">Ningún empleado ha sido asignado.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Ve a la pestaña de asignación para agregar personal.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
