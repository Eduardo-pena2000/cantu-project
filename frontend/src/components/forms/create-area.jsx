"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { getEmployees } from "@/lib/queries";
import { createArea } from "@/actions/areas";
import { createAreaSchema, defaultValues } from "@/schemas/area";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AsyncSelect } from "@/components/async-select";
import { CancelButtonForm } from "@/components/cancel-button-form";

export function CreateAreaForm({ onFormSubmit, className }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createAreaSchema),
    defaultValues,
  });

  function handleCancel() {
    router.replace("/store/areas");
  }

  async function onSubmit(values) {
    const res = await createArea(values);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "create-area" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "create-area" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/store/areas");
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
              <FormLabel className="w-fit">Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del área." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manager_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Selecciona un encargado</FormLabel>
              <FormControl>
                <AsyncSelect
                  optionsKey="employees"
                  value={field.value}
                  searchLabel="Buscar encargado..."
                  dtoFn={(employee) => ({
                    value: employee.id,
                    label: employee.shortFullName,
                  })}
                  getOptions={getEmployees}
                  onValueChange={field.onChange}
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
  );
}
