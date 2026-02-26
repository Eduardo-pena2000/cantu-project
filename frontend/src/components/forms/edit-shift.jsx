"use client";

import { useRouter } from "next/navigation";
import { AlarmClock, Loader, Plus, Save, Trash2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { updateShiftById } from "@/actions/shifts";
import { SCHEDULES } from "@/data/constants";
import { editShiftSchema, getDefaultValues } from "@/schemas/shift";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Subtitle } from "@/components/subtitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CancelButtonForm } from "@/components/cancel-button-form";

export function EditShiftForm({ shift, onFormSubmit, className }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(editShiftSchema),
    defaultValues: getDefaultValues(shift),
  });
  const schedulesField = useWatch({ control: form.control, name: "schedules" });

  function handleAddSchedule(schedule) {
    form.setValue("schedules", {
      ...schedulesField,
      [schedule.week_day]: { ...schedule, start_time: "", end_time: "" },
    });
  }

  function handleRemoveSchedule(weekDay) {
    form.setValue("schedules", { ...schedulesField, [weekDay]: undefined });
  }

  function handleCancel() {
    router.replace("/store/shifts");
  }

  async function onSubmit({ name, manager_id, temporal_manager, schedules }) {
    const data = {
      name,
      manager_id: manager_id ?? undefined,
      temporal_manager: temporal_manager ?? undefined,
      schedules: Object.values(schedules).reduce((acc, schedule) => {
        if (schedule === undefined) return acc;

        return [...acc, schedule];
      }, []),
    };

    const res = await updateShiftById(shift.id, data);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "edit-shift" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "edit-shift" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/store/shifts");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        <div className="space-y-2">
          <Subtitle>General</Subtitle>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-fit">Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del turno." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Subtitle>
            <AlarmClock /> Horario
          </Subtitle>
          <ul className="divide-y divide-solid">
            {SCHEDULES.map((schedule, index) => (
              <li
                key={schedule.week_day}
                className={cn("grid gap-1.5", index === 0 ? "pb-4" : "py-4")}
              >
                <div className="flex justify-between items-end-safe gap-4">
                  <span className="text-muted-foreground text-sm font-semibold">
                    {schedule.day}
                  </span>
                  {!schedulesField[schedule.week_day] ? (
                    <Button
                      onClick={() => handleAddSchedule(schedule)}
                      type="button"
                      variant="text"
                      size="sm"
                      className="h-auto"
                    >
                      <Plus /> Agregar horario
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRemoveSchedule(schedule.week_day)}
                      type="button"
                      variant="text"
                      size="sm"
                      className="text-destructive h-auto"
                    >
                      <Trash2 /> Remover horario
                    </Button>
                  )}
                </div>
                {!!schedulesField[schedule.week_day] && (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => {
                          form.setValue(`schedules.${schedule.week_day}.start_time`, "07:00");
                          form.setValue(`schedules.${schedule.week_day}.end_time`, "15:00");
                        }}
                      >
                        <Sun className="h-3.5 w-3.5" /> Mañana (7am - 3pm)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => {
                          form.setValue(`schedules.${schedule.week_day}.start_time`, "15:00");
                          form.setValue(`schedules.${schedule.week_day}.end_time`, "22:00");
                        }}
                      >
                        <Moon className="h-3.5 w-3.5" /> Tarde (3pm - 10pm)
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid w-full max-w-3xs items-start gap-2">
                        <FormField
                          control={form.control}
                          name={`schedules.${schedule.week_day}.start_time`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="w-fit">Hora inicio</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <FormField
                          control={form.control}
                          name={`schedules.${schedule.week_day}.end_time`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="w-fit">Hora fin</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {
            form.formState.errors.schedules?.root && (
              <FormMessage>{form.formState.errors.schedules.root.message}</FormMessage>
            )
          }
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
