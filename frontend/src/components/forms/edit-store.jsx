"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader, MapPinHouse, Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib";
import { updateStoreById } from "@/actions/stores";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
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
import { Label } from "@/components/ui/label";
import { CancelButtonForm } from "@/components/cancel-button-form";

const formSchema = z.object({
  name: z.string().trim().min(1, "Este campo es obligatorio."),
  address: z.string().trim().min(1, "Este campo es obligatorio."),
  address_detail: z.string().trim().min(1, "Este campo es obligatorio."),
  suburb_name: z.string().trim(),
  zip_code: z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio.")
    .length(5, "El código postal debe contener 5 dígitos."),
  municipality: z.string().trim().min(1, "Este campo es obligatorio."),
});

export function EditStoreForm({ store, onFormSubmit, className }) {
  const [img, setImg] = React.useState(null);

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name ?? "",
      address: store.address ?? "",
      address_detail: store.addressDetail ?? "",
      suburb_name: store.suburbName ?? "",
      zip_code: store.zipCode ?? "",
      municipality: store.municipality ?? "",
    },
  });

  function getImageSrc() {
    const storeImage = store.image;

    if (storeImage) {
      return storeImage;
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
    router.replace("/stores");
  }

  async function onSubmit(values) {
    const data = new FormData();

    for (const field in values) {
      if (Object.prototype.hasOwnProperty.call(values, field)) {
        data.append(field, values[field]);
      }
    }

    if (img) {
      data.append("avatar", img);
    }

    const res = await updateStoreById(store.id, data);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "update-store" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "update-store" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/stores");
    }
  }

  return (
    <div className={cn("w-full max-w-prose space-y-4 mx-auto", className)}>
      <div className="h-44 relative">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 w-full rounded-3xl relative">
          <Image
            className="bg-accent size-24 border-4 border-background aspect-square object-cover object-center rounded-full absolute bottom-0 left-4 translate-y-1/2"
            src={getImageSrc() ?? "/store.svg"}
            alt="Imagen de tienda"
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

      <Title className="text-lg font-semibold">{store.name}</Title>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Subtitle className="mb-4">General</Subtitle>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                      Nombre
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
            </div>
          </div>

          <div>
            <Subtitle className="mb-4">
              <MapPinHouse /> Dirección
            </Subtitle>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                      Dirección
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
                name="address_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                      Descripción
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
                name="suburb_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                      Barrio
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
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                      Código postal
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
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm font-semibold w-fit">
                      Municipio
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
              <FormField name="root" render={() => <FormMessage />} />
            </div>
          </div>

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
