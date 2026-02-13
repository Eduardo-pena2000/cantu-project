import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarClock, Crown, SquarePen, UserCheck, UsersRound } from "lucide-react";

import { auth } from "@/auth";
import { AppError, fetchApi } from "@/lib";
import { formatDate, hasRole, safeUrlDecode } from "@/utils";
import { teamWithUsersDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  const res = await fetchApi(`/team/${decodeId}`, {
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
        "Hubo un error al intentar obtener el equipo de trabajo. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const team = teamWithUsersDto(body);

  const links = [
    { label: session.store.code, href: "/" },
    { label: "Equipos de trabajo", href: "/store/work-teams" },
    { label: team.code },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div>
        <Title className="max-w-prose truncate">{team.name}</Title>
        <div className="space-x-2">
          <Button asChild size="icon" variant="ghost">
            <Link href={`/store/work-teams/${id}/edit`} className="cursor-default">
              <SquarePen />
            </Link>
          </Button>
          <DeleteButton id={decodeId} redirectTo="/store/work-teams" />
        </div>
      </div>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>General</Subtitle>
        <div className="grid">
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <span>{team.name}</span>
        </div>
        <div className="grid">
          <span className="text-muted-foreground text-sm font-semibold">Código</span>
          <span>{team.code}</span>
        </div>
      </section>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>
          <CalendarClock /> Turno de trabajo
        </Subtitle>
        <div className="grid">
          <span className="text-muted-foreground text-sm font-semibold">Nombre</span>
          <span>{team.shift.name}</span>
        </div>
      </section>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>
          <UserCheck /> Encargado
        </Subtitle>
        <div className="grid gap-2">
          <span className="text-muted-foreground text-sm font-semibold">Encargado principal</span>
          <div>
            <div className="flex items-center gap-2">
              <Image
                src={team.manager.image ?? "/user-round.svg"}
                alt={`Imagen de ${team.manager.fullName}`}
                width={40}
                height={40}
                className="size-10 shadow shrink-0 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span>{team.manager.fullName}</span>
                <span className="text-xs text-muted-foreground">{team.manager.email}</span>
              </div>
            </div>
          </div>
        </div>
        {team.temporalManager && (
          <div className="grid gap-2">
            <span className="text-muted-foreground text-sm font-semibold">Encargado temporal</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Image
                  src={team.temporalManager.image ?? "/user-round.svg"}
                  alt={`Imagen de ${team.temporalManager.fullName}`}
                  width={40}
                  height={40}
                  className="size-10 shadow shrink-0 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span>{team.temporalManager.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {team.temporalManager.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm leading-tight">
                  <span className="font-semibold">Apartir de:</span>{" "}
                  {formatDate({ date: new Date(team.temporalManager.startDate) })}
                </span>
                <span className="text-muted-foreground text-sm leading-tight">
                  <span className="font-semibold">Hasta: </span>{" "}
                  {formatDate({ date: new Date(team.temporalManager.endDate) })}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <Separator />

      <section className="max-w-prose space-y-4">
        <Subtitle>
          <UsersRound /> Integrantes
        </Subtitle>
        {team.users.length > 0 ? (
          <ul className="space-y-4">
            {team.users.map((user) => (
              <li key={user.id}>
                <div className="flex items-center gap-2">
                  <Image
                    src={user.image ?? "/user-round.svg"}
                    alt={`Imagen de ${user.fullName}`}
                    width={40}
                    height={40}
                    className="size-10 shadow shrink-0 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="flex items-baseline gap-1">
                      {(user.id === team.manager.id || user.id === team.temporalManager?.id) && (
                        <Crown className="text-yellow-400 fill-yellow-400 size-3.5" />
                      )}
                      {user.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no hay empleados asignados a este equipo de trabajo</p>
        )}
      </section>
    </>
  );
}
