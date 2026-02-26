import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { AppError, cn, fetchApi } from "@/lib";
import { getUserShortFullName, hasRole, safeUrlDecode } from "@/utils";
import { employeeDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "../delete-button";

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || !session.store) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/user/${decodeId}`, {
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
        "Hubo un error al intentar obtener el empleado. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const employee = employeeDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Empleados", href: "/store/employees" },
    { label: employee.username },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Glow Blob */}
      <div className="absolute top-[-5%] right-[-5%] -z-10 w-96 h-96 bg-sidebar-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <CustomBreadcrumb links={links} />

      <div className="w-full max-w-3xl space-y-8 mx-auto relative z-10">
        <div className="h-44 relative mb-4">
          <div className="bg-gradient-to-r from-sidebar-primary/80 to-purple-600 h-32 w-full rounded-3xl relative shadow-lg overflow-hidden border border-border/20">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm mix-blend-overlay"></div>
            <Image
              className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-6 translate-y-1/2 shadow-xl ring-2 ring-background/50"
              src={employee.image ?? "/user-round.svg"}
              alt="Imagen de empleado"
              width={96}
              height={96}
              priority
            />
          </div>
          <div className="absolute right-0 bottom-4 space-x-2 bg-background/50 backdrop-blur-md p-1.5 rounded-xl border border-border/40 shadow-sm">
            <Button asChild size="icon" variant="ghost" className="hover:bg-background hover:shadow-sm transition-all rounded-lg">
              <Link href={`/store/employees/${id}/edit`} className="cursor-pointer">
                <SquarePen className="size-4" />
              </Link>
            </Button>
            <DeleteButton id={decodeId} redirectTo="/store/employees" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="text-3xl tracking-tight text-foreground/90">{getUserShortFullName(employee.names, employee.lastNames)}</Title>
        </div>

        <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5 rounded-2xl p-6 hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                Nombres
              </span>
              <div className="text-foreground font-medium">{employee.names}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                Apellidos
              </span>
              <div className="text-foreground font-medium">{employee.lastNames}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                Nombre de usuario
              </span>
              <div className="text-foreground font-medium font-mono bg-muted/40 px-2 py-0.5 rounded w-fit sm:w-auto">{employee.username}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                Correo electrónico
              </span>
              <div className="text-foreground font-medium">{employee.email}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1 sm:mb-0">
                Teléfono
              </span>
              <div className="text-foreground font-medium">{employee.phone}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between bg-background/50 p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-3 sm:mb-0 sm:mt-1">
                Área (as)
              </span>
              {employee.areas.length > 0 ? (
                <ul className="flex flex-wrap gap-2 sm:justify-end">
                  {employee.areas.map((area) => (
                    <li key={area.id} className="bg-card border border-border/50 rounded-lg px-3 py-1.5 shadow-sm text-sm">
                      <p className="font-semibold text-foreground leading-tight">{area.name}</p>
                      <span className="text-muted-foreground text-xs">{area.code}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground font-medium italic sm:mt-1">Sin asignar</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
