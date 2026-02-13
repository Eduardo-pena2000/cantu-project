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
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl shadow-sidebar-primary/20 border border-white/10 hover:shadow-sidebar-primary/30 transition-shadow duration-500">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="bg-white rounded-2xl p-3 shadow-lg">
            <Image
              className="h-24 w-auto object-contain"
              src="/logo.jpg"
              alt="El Ofertón de Cantú logo"
              width={200}
              height={100}
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-tight">
              El Ofertón de Cantú
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Sistema de Gestión
            </p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          type="email"
                          name="email"
                          autoComplete="off"
                          placeholder="usuario@email.com"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.85_0.15_90)]"
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
                        <FormLabel className="text-white/90">Contraseña</FormLabel>
                        <Link
                          href="/recover"
                          className="ml-auto inline-block text-sm text-white/60 underline-offset-4 hover:underline hover:text-white/80 transition-colors"
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
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.85_0.15_90)]"
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
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                  type="submit"
                  className="w-full bg-[oklch(0.85_0.15_90)] text-[oklch(0.17_0.05_250)] hover:bg-[oklch(0.80_0.15_90)] font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
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

      <p className="text-center text-xs text-white/40">
        El Ofertón de Cantú® — Todos los derechos reservados
      </p>
    </div>
  );
}
