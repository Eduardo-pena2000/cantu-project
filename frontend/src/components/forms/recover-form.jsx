"use client";

import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio.")
    .email("Ingrese un correo electrónico válido."),
});

export function RecoverForm({ className, ...props }) {
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { email: "" } });

  async function onSubmit(values) {}

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Image
        className="size-40 shadow-sm aspect-square object-cover object-center rounded-full mx-auto"
        src="/globe.svg"
        alt="El ofertón de Cantú logo"
        width={160}
        height={160}
        priority
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        name="email"
                        autoComplete="off"
                        placeholder="usuario@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-baseline gap-3">
              <span>¿Ya tienes una cuenta?</span>
              <Link href="/login" className="text-sm underline-offset-4 hover:underline">
                Iniciar sesión
              </Link>
            </div>
            <FormField name="root" render={() => <FormMessage />} />
            <div className="flex flex-col gap-3">
              <Button
                disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                type="submit"
                className="w-full"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
