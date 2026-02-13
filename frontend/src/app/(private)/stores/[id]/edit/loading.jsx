import { MapPinHouse } from "lucide-react";

import { BreadcrumbSkeleton } from "@/components/breadcrumb-skeleton";
import { Subtitle } from "@/components/subtitle";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default async function Loading() {
  return (
    <>
      <BreadcrumbSkeleton itemsCount={3} />

      <div className="w-full max-w-prose space-y-4 mx-auto">
        <div className="h-44 relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
            <div className="bg-background size-24 border-4 border-background aspect-square rounded-full absolute bottom-0 left-4 translate-y-1/2">
              <Skeleton className="size-full rounded-full" />
            </div>
          </div>

          <Skeleton className="w-full max-w-[156px] h-8 absolute right-0 bottom-0" />
        </div>

        <Skeleton className="max-w-52 h-7 rounded-xs" />

        <section className="pt-4">
          <Subtitle className="mb-4">General</Subtitle>
          <div className="flex flex-col gap-4">
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Nombre
              </span>
              <div className="h-9 flex items-center">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Código
              </span>
              <div className="h-9 flex items-center uppercase">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
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
              <div className="h-9 flex items-center">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Descripción
              </span>
              <div className="h-9 flex items-center">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Barrio
              </span>
              <div className="h-9 flex items-center">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Código postal
              </span>
              <div className="h-9 flex items-center">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
            </div>
            <div className="leading-tight grid grid-cols-[1fr_2fr] gap-4">
              <span className="text-muted-foreground text-sm font-semibold leading-none">
                Municipio
              </span>
              <div className="h-9 flex items-center">
                <Skeleton className="w-full max-w-3xs h-5 rounded-xs" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
