import Image from "next/image";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { getUserShortFullName } from "@/utils";
import { userDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const res = await fetchApi(`/user/${session.user.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return notFound();
    }
  }

  const json = await res.json();

  const { body } = json;
  const profile = userDto(body);

  const links = [{ label: "Inicio", href: "/" }, { label: "Perfil" }];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="w-full max-w-prose space-y-4 mx-auto">
        <div className="h-44 relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
            <Image
              className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-4 translate-y-1/2"
              src={profile.image ?? "/user-round.svg"}
              alt={`Imagen de ${profile.names} ${profile.lastNames}`}
              width={96}
              height={96}
              priority
            />
          </div>
        </div>

        <Title className="text-lg font-semibold">
          {getUserShortFullName(profile.names, profile.lastNames)}
        </Title>

        <section className="pt-4">
          <Subtitle className="mb-4">
            <User /> Mi perfil
          </Subtitle>
          <div className="flex flex-col gap-4">
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombres
              </span>
              <div className="h-9 flex items-center">{profile.names}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Apellidos
              </span>
              <div className="h-9 flex items-center">{profile.lastNames}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Usuario
              </span>
              <div className="h-9 flex items-center">{profile.username}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Correo electrónico
              </span>
              <div className="h-9 flex items-center">{profile.email}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Teléfono
              </span>
              <div className="h-9 flex items-center">{profile.phone}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Última conexión
              </span>
              <div className="h-9 flex items-center">{profile.lastLogin ?? "Sin información"}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Rol (es)
              </span>
              <ul className="grid gap-1">
                {profile.roles.map((role) => (
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
