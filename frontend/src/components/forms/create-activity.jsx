"use client";

import { useRouter } from "next/navigation";
import { Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { getAreas } from "@/lib/queries";
import { createActivity } from "@/actions/activities";
import { createActivitySchema, defaultValues } from "@/schemas/activity";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AsyncSelect } from "@/components/async-select";
import { CancelButtonForm } from "@/components/cancel-button-form";

export function CreateActivityForm({ jobRoleId, onFormSubmit, className }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createActivitySchema),
    defaultValues,
  });

  function handleCancel() {
    router.replace("/store/activities");
  }

  async function onSubmit(values) {
    const res = await createActivity({ ...values, job_role_id: jobRoleId });

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "create-activity" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "create-activity" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/store/activities");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la actividad." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la actividad."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Por favor, proporciona una descripción detallada de la actividad. Esto ayudará a los
                responsables a entender claramente qué se debe realizar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Selecciona el área</FormLabel>
              <FormControl>
                <AsyncSelect
                  optionsKey="areas"
                  value={field.value}
                  searchLabel="Buscar área..."
                  dtoFn={(area) => ({
                    value: area.id,
                    label: area.name,
                  })}
                  getOptions={getAreas}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Selecciona el área correspondiente a esta actividad. Esto permitirá asignarla
                correctamente dentro de la organización.
              </FormDescription>
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
  );
}
