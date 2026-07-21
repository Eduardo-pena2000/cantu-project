"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon, SlidersHorizontal, Search } from "lucide-react";

import { getStoreAreas, getStores, getJobRoles } from "@/lib/queries";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AsyncSelect } from "@/components/async-select";
import { Input } from "@/components/ui/input";

const filtersSchema = z.object({
  date: z
    .object({
      from: z.date({
        required_error: "Debes seleccionar una fecha.",
      }),
    }),
  store: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z.number({
      invalid_type_error: "Selecciona una tienda válida.",
      required_error: "Debes seleccionar una tienda.",
    }).positive("Debes seleccionar una tienda.")
  ),
  area: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z.number().positive().optional()
  ).optional(),
  role: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z.number().positive().optional()
  ).optional(),
  name: z.string().optional(),
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

  const FormFields = () => (
    <div className="space-y-4">
      {/* Date */}
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="w-fit">
              Día de Trabajo <span className="text-destructive">*</span>
            </FormLabel>
            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    {field.value?.from ? (
                      <span className="text-foreground">
                        {format(field.value?.from, "PPP")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Selecciona un día</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value?.from}
                  onSelect={(date) => field.onChange({ from: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
            <FormDescription>Elige el día que deseas consultar.</FormDescription>
          </FormItem>
        )}
      />

      {/* Store */}
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

      {/* Area */}
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

      {/* Role */}
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="w-fit">Rol de Trabajo</FormLabel>
            <FormControl>
              <AsyncSelect
                modal
                optionsKey="roles"
                value={field.value}
                searchLabel="Buscar rol..."
                dtoFn={(role) => ({
                  value: role.id,
                  label: role.name,
                })}
                getOptions={getJobRoles}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Employee Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="w-fit">Nombre del Trabajador</FormLabel>
            <FormControl>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Ej. Juan Pérez"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="fixed bottom-4 right-4 z-50">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros Avanzados
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros Históricos</SheetTitle>
            <SheetDescription>
              Ajusta los filtros para consultar las actividades y calificaciones en fechas pasadas.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="h-full px-4 pb-4 flex flex-col justify-between"
            >
              <div className="mt-6 flex-1 overflow-y-auto pr-2">
                 <FormFields />
              </div>
              <div className="flex justify-between items-center gap-4 pt-6 border-t mt-4">
                <SheetClose asChild>
                  <Button variant="outline" className="w-28">
                    Cancelar
                  </Button>
                </SheetClose>
                <Button type="submit" className="w-28">
                  Buscar
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
        <Button className="fixed bottom-4 right-4 z-50">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filtros Históricos</DrawerTitle>
          <DrawerDescription>
            Ajusta los filtros para consultar el historial de trabajo.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <FormFields />
            <div className="flex justify-between items-center gap-4 pt-4">
              <DrawerClose asChild>
                <Button variant="outline" className="w-28">
                  Cancelar
                </Button>
              </DrawerClose>
              <Button type="submit" className="w-28">
                Buscar
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
