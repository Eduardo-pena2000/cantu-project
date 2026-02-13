"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib";
import { getUserShortFullName } from "@/utils";
import { updateEmployeeById } from "@/actions/employees";
import { roles } from "@/data";

import { Title } from "@/components/title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CancelButtonForm } from "@/components/cancel-button-form";

const formSchema = z.object({
  names: z.string().trim().min(1, "Este campo es obligatorio."),
  last_names: z.string().trim().min(1, "Este campo es obligatorio."),
  username: z
    .string()
    .trim()
    .min(5, "El nombre de usuario debe tener al menos 4 caracteres.")
    .max(20, "El nombre de usuario debe tener como máximo 20 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio.")
    .email("Ingrese un correo electrónico válido."),
  phone: z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio.")
    .length(10, "El teléfono debe contener 10 dígitos."),
});

export function EditEmployeeForm({ employee, onFormSubmit, className }) {
  const [img, setImg] = React.useState(null);

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: employee.names ?? "",
      last_names: employee.lastNames ?? "",
      username: employee.username ?? "",
      email: employee.email ?? "",
      phone: employee.phone ?? "",
    },
  });

  function getImageSrc() {
    const employeeImage = employee.image;

    if (employeeImage) {
      return employeeImage;
    }

    if (img) {
      return URL.createObjectURL(img);
    }

    return null;
  }

  function handleChangeImg(e) {
    const file = e.target?.files?.[0] ?? null;
    const validMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (file && validMimeTypes.includes(file.type)) {
      setImg(file);
    }
  }

  function handleCancel() {
    router.replace("/store/employees");
  }

  async function onSubmit(values) {
    const data = new FormData();

    for (const field in values) {
      if (Object.prototype.hasOwnProperty.call(values, field)) {
        data.append(field, values[field]);
      }
    }

    const employeeRole = roles.find((role) => role.label === "Empleado");
    if (employeeRole) {
      data.append("roles", JSON.stringify([employeeRole.value]));
    } else {
      data.append("roles", JSON.stringify(employee.roles));
    }

    if (img) {
      data.append("avatar", img);
    }

    const res = await updateEmployeeById(employee.id, data);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "update-employee" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "update-employee" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/store/employees");
    }
  }

  return (
    <div className={cn("w-full max-w-prose space-y-4 mx-auto", className)}>
      <div className="h-44 relative">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
          <Image
            className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-4 translate-y-1/2"
            src={getImageSrc() ?? "/user-round.svg"}
            alt="Imagen de usuario"
            width={96}
            height={96}
            priority
          />
        </div>

        <div className="absolute right-0 bottom-0 space-x-2">
          <Button asChild size="sm">
            <Label htmlFor="img">
              <ImageIcon /> <span>{!getImageSrc() ? "Agregar imagen" : "Cambiar imagen"}</span>
            </Label>
          </Button>
          <Input
            hidden
            type="file"
            id="img"
            onChange={handleChangeImg}
            accept={["image/jpeg", "image/jpg", "image/png"].join(", ")}
          />
        </div>
      </div>

      <Title className="text-xl font-semibold">
        {getUserShortFullName(employee.names, employee.lastNames)}
      </Title>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="names"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                  Nombres
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    type="text"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_names"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                  Apellidos
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    type="text"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                  Nombre de usuario
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    type="text"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                  Correo electrónico
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    type="text"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                  Teléfono
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    type="text"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <CancelButtonForm
              disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
              onCancel={handleCancel}
              className="grow"
            />
            <Button
              disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
              type="submit"
              className="grow"
            >
              {form.formState.isSubmitting ? <Loader className="animate-spin" /> : <Save />} Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
