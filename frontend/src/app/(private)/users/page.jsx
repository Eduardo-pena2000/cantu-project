import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { cn, fetchApi } from "@/lib";
import { getUserShortFullName, hasRole, safeUrlEncode } from "@/utils";
import { paginationDto, userDto } from "@/dtos";
import { ROLES } from "@/data/constants";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { NoResults } from "@/components/no-results";
import { CustomPagination } from "@/components/pagination";
import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DeleteButton } from "./delete-button";

export default async function Page({ searchParams }) {
  const queries = await searchParams;
  const session = await auth();

  const q = queries?.q ?? "";
  const currentPage = Number(queries?.page ?? 1);

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session, ["admin", "general_manager", "store_manager"]) || session.store) {
    redirect("/");
  }

  const res = await fetchApi(
    `/user?page=${currentPage}&name=${q}&role=${ROLES.ADMIN.id}&role=${ROLES.GENERAL_MANAGER.id}&role=${ROLES.STORE_MANAGER.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw AppError.applicationError(
      "Hubo un error al intentar obtener los usuarios. Por favor, intenta nuevamente."
    );
  }

  const json = await res.json();

  const {
    body: { last_page, total_records, current_page, has_more_pages, data },
  } = json;
  const users = data.map((user) => userDto(user));
  const pagination = paginationDto({ last_page, total_records, current_page, has_more_pages });

  const links = [{ label: "Inicio", href: "/" }, { label: "Usuarios" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <Title>Usuarios</Title>

      <div className="flex flex-col min-[448px]:flex-row justify-between items-center gap-4">
        <Search className="max-w-md" placeholder="Buscar por nombre" />
        <Button asChild className="w-full min-[448px]:w-auto">
          <Link href="/users/new">
            <Plus /> Nuevo usuario
          </Link>
        </Button>
      </div>

      {users.length ? (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-4">
            {users.map((user) => (
              <li key={user.id} className="w-full max-w-xl">
                <Card>
                  <CardHeader>
                    <div className="flex items-end gap-2">
                      <Image
                        src={user.image ?? "/user-round.svg"}
                        alt={`Imagen de ${getUserShortFullName(user.names, user.lastNames)}`}
                        className="bg-primary-foreground shadow size-14 rounded-full object-cover shrink-0"
                        width={56}
                        height={56}
                      />
                      <div className="tracking-tight">
                        <h3 className="font-semibold line-clamp-1">
                          {getUserShortFullName(user.names, user.lastNames)}
                        </h3>
                        <p className="text-sm leading-tight line-clamp-1">{user.email}</p>
                        <p
                          className={cn(
                            "text-sm leading-tight after:size-2 after:rounded-full after:inline-block after:ml-2",
                            user.isActive ? "after:bg-green-500" : "after:bg-destructive"
                          )}
                        >
                          {user.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div>
                      <span className="text-muted-foreground text-sm font-semibold">Rol (es)</span>
                      <div>
                        {user.roles.map((role) => (
                          <p key={role.id} className="capitalize">
                            {role.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <CardAction className="w-full flex items-center gap-2">
                      <DeleteButton id={user.id} />
                      <Button asChild variant="ghost" size="icon">
                        <Link
                          href={`/users/${safeUrlEncode(user.id)}/edit`}
                          className="cursor-default"
                        >
                          <SquarePen />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="ml-auto">
                        <Link href={`/users/${safeUrlEncode(user.id)}`}>Ver detalles</Link>
                      </Button>
                    </CardAction>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>

          <CustomPagination className="sm:justify-end" totalPages={pagination.lastPage} />
        </div>
      ) : (
        <NoResults description="No se han encontrado usuarios." />
      )}
    </>
  );
}
