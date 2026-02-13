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
    <>
      <CustomBreadcrumb links={links} />

      <div>
        <Title className="max-w-prose">{area.name}</Title>
        <div className="space-x-2">
          <Button asChild size="icon" variant="ghost">
            <Link href={`/store/areas/${id}/edit`} className="cursor-default">
              <SquarePen />
            </Link>
          </Button>
          <DeleteButton id={decodeId} redirectTo="/store/employees" />
        </div>
      </div>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>General</Subtitle>
        <div className="grid">
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <span>{area.name}</span>
        </div>
        <div className="grid">
          <span className="text-muted-foreground text-sm font-semibold">Código</span>
          <span>{area.code}</span>
        </div>
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Encargado</span>
          {area.manager ? (
            <div className="py-1.5">
              <div className="flex items-end gap-2">
                <Image
                  src={area.manager.image ?? "/user-round.svg"}
                  alt={`Imagen de ${area.manager.shortFullName}`}
                  width={56}
                  height={56}
                  className="size-14 shadow-sm rounded-full object-cover aspect-square shrink-0"
                />
                <div>
                  <span className="text-sm font-medium">{area.manager.shortFullName}</span>
                  <p className="text-sm text-muted-foreground leading-none">
                    {area.manager.username}
                  </p>
                  <p className="text-sm text-muted-foreground">{area.manager.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Sin asignar</p>
          )}
        </div>
      </section>
    </>
  );
}
