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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
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
    <div className="flex flex-col gap-6 animate-fade-in relative max-w-[100vw] overflow-x-hidden pb-10">
      {/* Glow Blob */}
      <div className="absolute top-[-5%] right-[-5%] -z-10 w-96 h-96 bg-sidebar-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <CustomBreadcrumb links={links} />

      <div className="flex flex-col min-[480px]:flex-row justify-between items-start min-[480px]:items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-sidebar-primary rounded-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
          <Title className="max-w-prose truncate text-3xl tracking-tight text-foreground/90">{team.name}</Title>
        </div>
        <div className="flex gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
          <Button asChild size="icon" variant="ghost" className="hover:bg-background hover:shadow-sm transition-all rounded-lg">
            <Link href={`/store/work-teams/${id}/edit`} className="cursor-pointer">
              <SquarePen className="size-4" />
            </Link>
          </Button>
          <DeleteButton id={decodeId} redirectTo="/store/work-teams" />
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="grid md:grid-cols-2 gap-6 relative z-10 w-full mt-2">
        {/* Left Column - Details */}
        <div className="space-y-6">
          <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
            <Subtitle className="text-sidebar-primary mb-4">General</Subtitle>
            <div className="space-y-4">
              <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
                <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1">Nombre</span>
                <span className="text-foreground font-medium text-lg">{team.name}</span>
              </div>
              <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
                <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1">Código</span>
                <span className="text-foreground font-medium font-mono bg-muted/40 px-2 py-0.5 rounded w-fit">{team.code}</span>
              </div>
            </div>
          </section>

          <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
            <Subtitle className="flex items-center gap-2 mb-4 text-sidebar-primary">
              <CalendarClock className="size-5" /> Turno de trabajo
            </Subtitle>
            <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
              <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-1">Nombre</span>
              <span className="text-foreground font-medium">{team.shift.name}</span>
            </div>
          </section>

          <section className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
            <Subtitle className="flex items-center gap-2 mb-4 text-sidebar-primary">
              <UserCheck className="size-5" /> Responsables
            </Subtitle>
            <div className="space-y-4">
              <div className="flex flex-col bg-background/50 p-4 rounded-xl border border-border/30">
                <span className="text-muted-foreground text-[13px] font-semibold uppercase tracking-wider mb-3">Encargado principal</span>
                <div className="flex items-center gap-4">
                  <Avatar className="size-12 shadow-sm shrink-0 object-cover aspect-square ring-2 ring-sidebar-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage
                      src={team.manager.image ?? "/user-round.svg"}
                      alt={`Imagen de ${team.manager.fullName}`}
                    />
                    <AvatarFallback className="size-12 bg-muted/50 text-muted-foreground">
                      <UserRound size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{team.manager.fullName}</span>
                    <span className="text-sm text-muted-foreground">{team.manager.email}</span>
                  </div>
                </div>
              </div>

              {team.temporalManager && (
                <div className="flex flex-col bg-orange-500/5 p-4 rounded-xl border border-orange-500/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50" />
                  <span className="text-orange-600/80 dark:text-orange-400 text-[13px] font-semibold uppercase tracking-wider mb-3 pl-2">Encargado temporal</span>
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pl-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-12 shadow-sm shrink-0 object-cover aspect-square ring-2 ring-orange-500/30">
                        <AvatarImage
                          src={team.temporalManager.image ?? "/user-round.svg"}
                          alt={`Imagen de ${team.temporalManager.fullName}`}
                        />
                        <AvatarFallback className="size-12 bg-muted/50 text-muted-foreground">
                          <UserRound size={20} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{team.temporalManager.fullName}</span>
                        <span className="text-sm text-muted-foreground">
                          {team.temporalManager.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col bg-background/50 rounded-lg p-2 border border-border/30 text-sm w-fit sm:min-w-[140px]">
                      <span className="text-muted-foreground leading-tight flex justify-between gap-4">
                        <span className="font-semibold">De:</span>{" "}
                        {formatDate({ date: new Date(team.temporalManager.startDate) })}
                      </span>
                      <span className="text-muted-foreground leading-tight flex justify-between gap-4">
                        <span className="font-semibold">A: </span>{" "}
                        {formatDate({ date: new Date(team.temporalManager.endDate) })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Integrantes */}
        <section className="h-fit space-y-6 bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
          <Subtitle className="flex items-center gap-2 text-sidebar-primary">
            <UsersRound className="size-5" />
            Integrantes ({team.users?.length ?? 0})
          </Subtitle>

          <div className="bg-background/40 rounded-xl border border-border/40 overflow-hidden">
            {team.users.length > 0 ? (
              <ul className="divide-y divide-border/30 max-h-[600px] overflow-y-auto">
                {team.users.map((user) => (
                  <li key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
                    <Avatar className="size-10 shadow-sm shrink-0 object-cover aspect-square">
                      <AvatarImage
                        src={user.image ?? "/user-round.svg"}
                        className="group-hover:scale-105 transition-transform"
                      />
                      <AvatarFallback>
                        <UserRound className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        {(user.id === team.manager.id || user.id === team.temporalManager?.id) && (
                          <div className="bg-yellow-500/20 p-1 rounded-full shrink-0" title="Encargado">
                            <Crown className="text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400 size-3" />
                          </div>
                        )}
                        {user.fullName}
                      </span>
                      <span className="text-sm text-muted-foreground pl-[calc(1.125rem+0.375rem)]">{user.email}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/10 h-[200px]">
                <UsersRound className="size-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">Aún no hay empleados asignados a este equipo de trabajo.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Ve a la pestaña de asignación para agregar personal.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
