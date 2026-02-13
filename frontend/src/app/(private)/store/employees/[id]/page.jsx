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
    <>
      <CustomBreadcrumb links={links} />

      <div className="w-full max-w-prose space-y-4 mx-auto">
        <div className="h-44 relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
            <Image
              className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-4 translate-y-1/2"
              src={employee.image ?? "/user-round.svg"}
              alt="Imagen de empleado"
              width={96}
              height={96}
              priority
            />
          </div>
          <div className="absolute right-0 bottom-0 space-x-2">
            <Button asChild size="icon" variant="ghost">
              <Link href={`/store/employees/${id}/edit`} className="cursor-default">
                <SquarePen />
              </Link>
            </Button>
            <DeleteButton id={decodeId} redirectTo="/store/employees" />
          </div>
        </div>

        <Title>{getUserShortFullName(employee.names, employee.lastNames)}</Title>

        <section className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombres
              </span>
              <div className="h-9 flex items-center">{employee.names}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Apellidos
              </span>
              <div className="h-9 flex items-center">{employee.lastNames}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombre de usuario
              </span>
              <div className="h-9 flex items-center">{employee.username}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Correo electrónico
              </span>
              <div className="h-9 flex items-center">{employee.email}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Teléfono
              </span>
              <div className="h-9 flex items-center">{employee.phone}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Área (as)
              </span>
              {employee.areas.length > 0 ? (
                <ul className="grid gap-1">
                  {employee.areas.map((area) => (
                    <li key={area.id}>
                      <p>{area.name}</p>
                      <span className="text-muted-foreground text-sm">{area.code}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-9 flex items-center">Sin asignar</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
