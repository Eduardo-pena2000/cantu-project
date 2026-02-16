import Image from "next/image";
import { MapPinHouse } from "lucide-react";

import { CustomBreadcrumb } from "@/components/custom-breadcrumb";
import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { Separator } from "@/components/ui/separator";

export function AdminStoreView({ store, actions }) {
    const links = [
        { label: "Inicio", href: "/" },
        { label: "Tiendas", href: "/stores" },
        { label: store.code },
    ];

    return (
        <>
            <CustomBreadcrumb links={links} />

            <div className="w-full max-w-prose space-y-4 mx-auto animate-fade-in">
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
                    {actions}
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
