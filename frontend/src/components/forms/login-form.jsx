"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { getNotificationPermissionAndToken, hasRole } from "@/utils";

import { saveDeviceToken, signin } from "@/actions/auth";

import { ROLES } from "@/data/constants";

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
import { RootErrorMessage } from "@/components/root-error-message";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio.")
    .email("Ingrese un correo electrónico válido."),
  password: z.string().trim().min(1, { message: "Este campo es obligatorio." }),
});

export function LoginForm({ className, ...props }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = new URLSearchParams(searchParams);

  async function onSubmit(values) {
    const res = await signin({
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      form.setError("root", {
        message: res.error,
      });
    } else {
      const session = await getSession();

      router.replace(params.get("callbackUrl") ?? "/");

      if (
        hasRole(session, ROLES.SHIFT_MANAGER.slug, ROLES.TEMPORARY_SHIFT_MANAGER.slug) &&
        !session.hasDeviceToken
      ) {
        const deviceToken = await getNotificationPermissionAndToken();

        if (deviceToken) {
          const response = await saveDeviceToken(deviceToken);

          if (response.error) {
            toast.error(response.error.message, { id: "browser-notifications" });
          } else {
            toast.success(response.message, { id: "browser-notifications" });
          }
        }
      }
    }
  }

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
                        disabled={form.formState.isSubmitting}
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
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Contraseña</FormLabel>
                      <Link
                        href="/recover"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        type="password"
                        name="password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.root && (
              <RootErrorMessage message={form.formState.errors.root.message} />
            )}
            <div className="flex flex-col gap-3">
              <Button
                disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                type="submit"
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
