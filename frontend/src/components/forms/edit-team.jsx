"use client";

import { useRouter } from "next/navigation";
import { CalendarClock, Loader, Plus, Save, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { getEmployeesWithoutTeam, getShifts } from "@/lib/queries";
import { updateTeamById } from "@/actions/teams";
import { editTeamSchema, getDefaultValues } from "@/schemas/team";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Subtitle } from "@/components/subtitle";
import { AsyncSelect } from "@/components/async-select";
import { CancelButtonForm } from "@/components/cancel-button-form";

export function EditTeamForm({ team, onFormSubmit, className }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(editTeamSchema),
    defaultValues: getDefaultValues(team),
  });
  const hasTemporalManager = useWatch({ control: form.control, name: "temporal_manager" });

  function handleAddTemporalManager() {
    form.setValue("temporal_manager", { id: "", start_date: "", end_date: "" });
  }

  function handleRemoveTemporalManager() {
    form.resetField("temporal_manager", { defaultValue: null });
  }

  function handleCancel() {
    router.replace("/store/work-teams");
  }

  async function onSubmit(values) {
    const res = await updateTeamById(team.id, values);

    if (res.redirectTo) {
      return router.replace(res.redirectTo);
    }

    if (res.error) {
      toast.error(res.error.message, { id: "edit-team" });
      throw res.error.message;
    }

    toast.success(res.message, { id: "edit-team" });

    if (onFormSubmit) {
      onFormSubmit();
    } else {
      router.replace("/store/work-teams");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        <div className="space-y-2">
          <Subtitle>General</Subtitle>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-fit">Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del equipo de trabajo." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-1.5">
          <Separator />
        </div>

        <div className="space-y-2">
          <Subtitle>
            <CalendarClock /> Turno de trabajo
          </Subtitle>
          <FormField
            control={form.control}
            name="shift_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-fit">Selecciona un turno de trabajo disponible</FormLabel>
                <FormControl>
                  <AsyncSelect
                    optionsKey="shifts"
                    value={field.value}
                    initialInputValue={team.shift?.name}
                    searchLabel="Buscar turno de trabajo..."
                    dtoFn={(shift) => ({
                      value: shift.id,
                      label: shift.name,
                    })}
                    getOptions={getShifts}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Selecciona el turno al que estará asignado este equipo, definiendo así los días y
                  horarios en los que trabajará.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-1.5">
          <Separator />
        </div>

        <div className="space-y-2">
          <Subtitle>
            <UserCheck /> Encargado
          </Subtitle>
          <FormField
            control={form.control}
            name="manager_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-fit">Selecciona un encargado</FormLabel>
                <FormControl>
                  <AsyncSelect
                    optionsKey="employees-without-team"
                    value={field.value}
                    initialInputValue={team.manager?.shortFullName}
                    searchLabel="Buscar encargado..."
                    dtoFn={(employee) => ({
                      value: employee.id,
                      label: employee.shortFullName,
                    })}
                    getOptions={() => getEmployeesWithoutTeam()}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Selecciona a la persona que se encargará de registrar la asistencia del equipo de
                  trabajo, verificar el cumplimiento de actividades y supervisar el buen
                  funcionamiento general de la tienda durante el turno previamente especificado.
                </FormDescription>
              </FormItem>
            )}
          />
          <div
            className={cn(
              "pt-2 flex justify-end items-center",
              hasTemporalManager !== null && "pb-2"
            )}
          >
            {hasTemporalManager === null ? (
              <Button onClick={handleAddTemporalManager} type="button" variant="outline" size="sm">
                <Plus /> Agregar encargado temporal
              </Button>
            ) : (
              <Button
                onClick={handleRemoveTemporalManager}
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:text-destructive hover:bg-destructive/5"
              >
                <Trash2 /> Remover encargado temporal
              </Button>
            )}
          </div>
          {hasTemporalManager !== null && (
            <>
              <FormField
                control={form.control}
                name="temporal_manager.id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-fit">Selecciona un encargado temporal</FormLabel>
                    <FormControl>
                      <AsyncSelect
                        optionsKey="employees-without-team"
                        value={field.value}
                        initialInputValue={team.temporalManager?.shortFullName}
                        searchLabel="Buscar encargado temporal..."
                        dtoFn={(employee) => ({
                          value: employee.id,
                          label: employee.shortFullName,
                        })}
                        getOptions={() => getEmployeesWithoutTeam()}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Selecciona a la persona que asumirá temporalmente la supervisión del equipo de
                      trabajo. Esta persona será responsable de tomar asistencia, verificar el
                      cumplimiento de tareas y asegurar el correcto funcionamiento de la tienda
                      durante el periodo indicado. Especifica la fecha de inicio y fin de esta
                      responsabilidad.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full max-w-3xs items-start gap-2">
                  <FormField
                    control={form.control}
                    name="temporal_manager.start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-fit">Fecha inicio</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full max-w-3xs items-start gap-2">
                  <FormField
                    control={form.control}
                    name="temporal_manager.end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-fit">Fecha fin</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}
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
