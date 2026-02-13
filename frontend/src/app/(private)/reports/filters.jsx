"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, subDays } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";

import { getStoreAreas, getStores } from "@/lib/queries";

import { useMediaQuery } from "@/hooks/use-media-query";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AsyncSelect } from "@/components/async-select";

const filtersSchema = z.object({
  date: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .superRefine((date, ctx) => {
      if (!date.from || !date.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [],
          message: "Selecciona un rango de fechas válido.",
        });
        return;
      }

      if (!date.from instanceof Date || !date.to instanceof Date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [],
          message: "Selecciona un rango de fechas válido.",
        });
        return;
      }

      if (date.to < date.from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [],
          message: "La fecha final no puede ser anterior a la fecha inicial.",
        });
      }
    }),
  store: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number({
        invalid_type_error: "Selecciona una tienda válida.",
        required_error: "Este campo es requerido.",
      })
      .positive("Este campo es requerido.")
  ),
  area: z
    .preprocess(
      (val) => {
        if (val === "") return undefined;
        if (typeof val === "string") return Number(val);
        return val;
      },
      z
        .number({
          invalid_type_error: "Selecciona una área válida.",
        })
        .positive("Selecciona una área válida.")
    )
    .optional(),
  status: z
    .enum(["completed", "pending", "delayed"], {
      invalid_type_error: "Selecciona una opción válida.",
    })
    .optional(),
  order: z.enum(["desc", "asc"], {
    invalid_type_error: "Selecciona una opción válida.",
    required_error: "Este campo es requerido.",
  }),
});

export function Filters({ defaultValues, onSubmit }) {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    resolver: zodResolver(filtersSchema),
    defaultValues,
  });
  const store = form.watch("store");

  function handleSubmit(values) {
    onSubmit(values);
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="fixed bottom-4 right-4">
            <SlidersHorizontal />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Ajusta los filtros según los criterios deseados para visualizar los datos
              correspondientes al informe de cumplimiento de actividades.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="h-full px-4 pb-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-fit">
                        Fecha <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="pl-3 text-left font-normal">
                              {field.value?.from ? (
                                <span className="text-muted-foreground">
                                  {field.value.to
                                    ? `${format(field.value?.from, "dd-MM-yyyy")} | ${format(
                                        field.value?.to,
                                        "dd-MM-yyyy"
                                      )}`
                                    : format(field.value?.from, "PPP")}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Rango de búsqueda.</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              new Date(date) < subDays(field.value?.from, 30) ||
                              new Date(date) > addDays(field.value?.from, 30)
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                      <FormDescription>
                        Por favor, selecciona un rango de fechas que no exceda los 31 días.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="store"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-fit">
                        Tienda <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <AsyncSelect
                          modal
                          optionsKey="stores"
                          value={field.value}
                          searchLabel="Buscar tienda..."
                          dtoFn={(store) => ({
                            value: store.id,
                            label: store.name,
                          })}
                          getOptions={getStores}
                          onValueChange={(value) => {
                            form.setValue("area", undefined);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-fit">Área</FormLabel>
                      <FormControl>
                        <AsyncSelect
                          modal
                          disabled={store === undefined}
                          optionsKey="areas"
                          value={field.value}
                          searchLabel="Buscar área..."
                          dtoFn={(area) => ({
                            value: area.id,
                            label: area.name,
                          })}
                          getOptions={(params) => getStoreAreas({ ...params, store })}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estatus</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una opción." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="delayed">Tardío</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordenar</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una opción." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="desc">Descendiente</SelectItem>
                          <SelectItem value="asc">Ascendente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <SheetClose asChild>
                  <Button variant="outline" className="w-28">
                    Cancelar
                  </Button>
                </SheetClose>
                <Button type="submit" className="w-28">
                  Aplicar
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-4 right-4">
          <SlidersHorizontal />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filtros</DrawerTitle>
          <DrawerDescription>
            Ajusta los filtros según los criterios deseados para visualizar los datos
            correspondientes al informe de cumplimiento de actividades.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-4 pb-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-fit">
                    Fecha <span className="text-destructive">*</span>
                  </FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className="pl-3 text-left font-normal">
                          {field.value?.from ? (
                            <span className="text-muted-foreground">
                              {field.value.to
                                ? `${format(field.value?.from, "dd-MM-yyyy")} | ${format(
                                    field.value?.to,
                                    "dd-MM-yyyy"
                                  )}`
                                : format(field.value?.from, "PPP")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Rango de búsqueda.</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          new Date(date) < subDays(field.value?.from, 30) ||
                          new Date(date) > addDays(field.value?.from, 30)
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                  <FormDescription>
                    Por favor, selecciona un rango de fechas que no exceda los 31 días.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="store"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-fit">
                    Tienda <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <AsyncSelect
                      modal
                      optionsKey="stores"
                      value={field.value}
                      searchLabel="Buscar tienda..."
                      dtoFn={(store) => ({
                        value: store.id,
                        label: store.name,
                      })}
                      getOptions={getStores}
                      onValueChange={(value) => {
                        form.setValue("area", undefined);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-fit">Área</FormLabel>
                  <FormControl>
                    <AsyncSelect
                      modal
                      disabled={store === undefined}
                      optionsKey="areas"
                      value={field.value}
                      searchLabel="Buscar área..."
                      dtoFn={(area) => ({
                        value: area.id,
                        label: area.name,
                      })}
                      getOptions={(params) => getStoreAreas({ ...params, store })}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estatus</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una opción." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="delayed">Tardío</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordenar</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una opción." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="desc">Descendiente</SelectItem>
                      <SelectItem value="asc">Ascendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center gap-4">
              <DrawerClose asChild>
                <Button variant="outline" className="w-28">
                  Cancelar
                </Button>
              </DrawerClose>
              <Button type="submit" className="w-28">
                Aplicar
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
