import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MapPinHouse, SquarePen } from "lucide-react";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { hasRole, safeUrlDecode } from "@/utils";
import { storeDto } from "@/dtos";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { StoreSwitcher } from "@/components/store-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  const res = await fetchApi(`/store/${decodeId}`, {
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
        "Hubo un error al intentar obtener la tienda. Por favor, intenta nuevamente."
      );
    }
  }

  const json = await res.json();

  const { body } = json;
  const store = storeDto(body);

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Tiendas", href: "/stores" },
    { label: store.code },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />

      <div className="w-full max-w-prose space-y-4 mx-auto">
        <div className="h-44 relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
            <Image
              className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-4 translate-y-1/2"
              src={store.image ?? "/store.svg"}
              alt="Imagen de tienda"
              width={96}
              height={96}
              priority
            />
          </div>
          <div className="absolute right-0 bottom-0 space-x-2">
            <StoreSwitcher sessionStore={{ id: store.id, name: store.name, code: store.code }} />
            <Button asChild size="icon" variant="ghost">
              <Link href={`/stores/${id}/edit`} className="cursor-default">
                <SquarePen />
              </Link>
            </Button>
            <DeleteButton id={decodeId} redirectTo="/stores" />
          </div>
        </div>

        <Title>{store.name}</Title>

        <section className="pt-4">
          <Subtitle className="mb-4">General</Subtitle>
          <div className="flex flex-col gap-4">
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombre
              </span>
              <div className="h-9 flex items-center">{store.name}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Código
              </span>
              <div className="h-9 flex items-center uppercase">{store.code}</div>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <Subtitle className="mb-4">
            <MapPinHouse /> Dirección
          </Subtitle>
          <div className="flex flex-col gap-4">
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Dirección
              </span>
              <div className="h-9 flex items-center">{store.address ?? "Sin información."}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Descripción
              </span>
              <div className="h-9 flex items-center">
                {store.addressDetail ?? "Sin información."}
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Barrio
              </span>
              <div className="h-9 flex items-center">{store.suburbName ?? "Sin información."}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Código postal
              </span>
              <div className="h-9 flex items-center">{store.zipCode ?? "Sin información."}</div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Municipio
              </span>
              <div className="h-9 flex items-center">
                {store.municipality ?? "Sin información."}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
