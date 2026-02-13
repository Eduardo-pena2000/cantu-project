import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Layers, Package, SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { formatDate, hasRole, safeUrlDecode } from "@/utils";
import { activityDto } from "@/dtos";

import { ROLES } from "@/data/constants";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { DeleteActivityButton } from "../delete-activity-button";

export default async function Page({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (
    !session.store ||
    !hasRole(session, [
      ROLES.ADMIN.slug,
      ROLES.GENERAL_MANAGER.slug,
      ROLES.STORE_MANAGER.slug,
      ROLES.SHIFT_MANAGER.slug,
      ROLES.TEMPORARY_SHIFT_MANAGER.slug,
    ])
  ) {
    redirect("/");
  }

  const decodeId = Number(safeUrlDecode(id));

  const res = await fetchApi(`/activitie/${decodeId}`, {
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
        "Hubo un error al intentar obtener la actividad. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const activity = activityDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Actividades", href: "/store/activities" },
    { label: activity.name },
  ];

  return (
    <main className="space-y-4">
      <CustomBreadcrumb links={links} />

      <div>
        <Title className="max-w-prose">{activity.name}</Title>
        <div className="space-x-2">
          <Button asChild size="icon" variant="ghost">
            <Link href={`/store/activities/${id}/edit`} className="cursor-default">
              <SquarePen />
            </Link>
          </Button>
          <DeleteActivityButton id={decodeId} redirectTo="/store/activities" />
        </div>
      </div>

      <section className="max-w-prose space-y-4">
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <p>{activity.name}</p>
          <p className="text-muted-foreground text-sm">
            Creada el {formatDate({ date: new Date(activity.createdAt) })}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Descripción</span>
          <p>{activity.description}</p>
        </div>
      </section>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>
          <Layers /> Rol de trabajo
        </Subtitle>
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <p>{activity.jobRole.name}</p>
          <p className="text-muted-foreground text-sm">{activity.jobRole.code}</p>
        </div>
      </section>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>
          <Package /> Área
        </Subtitle>
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <p>{activity.area.name}</p>
          <p className="text-muted-foreground text-sm">{activity.area.code}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm font-semibold">Encargado</span>
          {activity.area.manager ? (
            <div className="py-1.5">
              <div className="flex items-end gap-2">
                <Image
                  src={activity.area.manager.image ?? "/user-round.svg"}
                  alt={`Imagen de ${activity.area.manager.fullName}`}
                  width={56}
                  height={56}
                  className="size-14 shadow-sm rounded-full object-cover aspect-square shrink-0"
                />
                <div>
                  <span className="text-sm font-medium">{activity.area.manager.fullName}</span>
                  <p className="text-sm text-muted-foreground leading-none">
                    {activity.area.manager.username}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.area.manager.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Sin asignar</p>
          )}
        </div>
      </section>
    </main>
  );
}
