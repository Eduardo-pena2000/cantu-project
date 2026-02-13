"use client";

import * as React from "react";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const createConfirmationSchema = function (confirmationText) {
  const schema = z.object({
    confirmation: z
      .string()
      .min(1, "Este campo es obligatorio.")
      .refine((val) => val === confirmationText, {
        message: "El texto de confirmación no coincide",
      }),
  });

  return schema;
};

export function ConfirmationAlerDialog({
  open,
  setOpen,
  title,
  message,
  label,
  confirmationText,
  onSubmit,
}) {
  const formSchema = React.useMemo(
    () => createConfirmationSchema(confirmationText),
    [confirmationText]
  );

  const defaultValues = {
    confirmation: "",
  };

  const formRef = React.useRef();

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function handleCancel() {
    form.reset(defaultValues);
    setOpen(false);
  }

  function handleConfirm() {
    formRef.current.requestSubmit();
  }

  async function submit() {
    await onSubmit();
    setOpen(false);
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-sm w-fit">{label}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                      type="text"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter className="sm:justify-between">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
          >
            {form.formState.isSubmitting && <Loader className="animate-spin" />} Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
