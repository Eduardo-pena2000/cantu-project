import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { cn, fetchApi } from "@/lib";
import { getUserShortFullName, hasRole, safeUrlDecode } from "@/utils";
import { userDto } from "@/dtos";

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

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || session.store) {
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
        "Hubo un error al intentar obtener el usuario. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const user = userDto(body);

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Usuarios", href: "/users" },
    { label: user.username },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="w-full max-w-prose space-y-4 mx-auto">
        <div className="h-44 relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
            <Image
              className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-4 translate-y-1/2"
              src={user.image ?? "/user-round.svg"}
              alt="Imagen de usuario"
              width={96}
              height={96}
              priority
            />
          </div>
          <div className="absolute right-0 bottom-0 space-x-2">
            <Button asChild size="icon" variant="ghost">
              <Link href={`/users/${id}/edit`} className="cursor-default">
                <SquarePen />
              </Link>
            </Button>
            <DeleteButton id={decodeId} redirectTo="/users" />
          </div>
        </div>

        <Title>{getUserShortFullName(user.names, user.lastNames)}</Title>

        <section className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombres
              </span>
              <div className="h-9 flex items-center">{user.names}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Apellidos
              </span>
              <div className="h-9 flex items-center">{user.lastNames}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombre de usuario
              </span>
              <div className="h-9 flex items-center">{user.username}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Correo electrónico
              </span>
              <div className="h-9 flex items-center">{user.email}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Teléfono
              </span>
              <div className="h-9 flex items-center">{user.phone}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Estatus
              </span>
              <div
                className={cn(
                  "h-9 flex items-center after:size-2 after:rounded-full after:inline-block after:ml-2",
                  user.isActive ? "after:bg-green-500" : "after:bg-destructive"
                )}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Última conexión
              </span>
              <div className="h-9 flex items-center">{user.lastLogin ?? "Sin información"}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Rol (es)
              </span>
              <ul className="grid gap-1">
                {user.roles.map((role) => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
