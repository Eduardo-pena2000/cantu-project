"use client";

import { useRouter } from "next/navigation";
import { Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { updateJobRoleById } from "@/actions/job-roles";
import { editJobRoleSchema, getDefaultValues } from "@/schemas/job-role";

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
import { CancelButtonForm } from "@/components/cancel-button-form";

export function EditJobRoleForm({ jobRole, onFormSubmit, className }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(editJobRoleSchema),
    defaultValues: getDefaultValues(jobRole),
  });

  function handleCancel() {
    router.replace("/store/activities");
  }

  async function onSubmit(values) {
    const res = await updateJobRoleById(jobRole.id, values);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "update-job-role" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "update-job-role" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/store/activities");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-fit">Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del rol de trabajo." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
  );
}
