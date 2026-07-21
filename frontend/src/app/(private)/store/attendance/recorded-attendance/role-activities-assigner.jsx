"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CopyPlus, FileStack, Plus, ChevronDown, Sparkles } from "lucide-react";

import { getJobRoleActivities } from "@/lib/queries";
import { bulkAssignActivities } from "@/actions/activities";
import { createActivity } from "@/actions/activities/create-activity.action.js";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { Areas } from "./areas";

export function RoleActivitiesAssigner({ employee, scheduleId, handleClose }) {
  const queryClient = useQueryClient();
  const primaryRoleId = employee?.roles?.[0]?.id;
  const primaryAreaId = employee?.areas?.[0]?.id;

  const [selectedActivities, setSelectedActivities] = React.useState(new Map());
  const [showExtra, setShowExtra] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // Fetch role-specific activities
  const { data: activitiesData, isPending: isLoadingActivities } = useQuery({
    queryKey: ["jobRoleActivities", primaryRoleId],
    queryFn: () => getJobRoleActivities({ jobRoleId: primaryRoleId, limit: 100 }),
    enabled: !!primaryRoleId,
  });

  // Pre-select activities that are not yet assigned
  React.useEffect(() => {
    if (activitiesData?.data) {
      const initialMap = new Map();
      activitiesData.data.forEach((activity) => {
        const existingAssigned = employee.attendance.activities.find(
          (a) => a.activity.id === activity.id
        );
        if (!existingAssigned) {
          initialMap.set(activity.id, {
            selected: true,
            deadline: activity.default_deadline || "12:00",
          });
        }
      });
      setSelectedActivities(initialMap);
    }
  }, [activitiesData, employee]);

  const handleToggleActivity = (activityId) => {
    setSelectedActivities((prev) => {
      const next = new Map(prev);
      const current = next.get(activityId);
      if (current) {
        next.set(activityId, { ...current, selected: !current.selected });
      }
      return next;
    });
  };

  const handleDeadlineChange = (activityId, newDeadline) => {
    setSelectedActivities((prev) => {
      const next = new Map(prev);
      const current = next.get(activityId);
      if (current) {
        next.set(activityId, { ...current, deadline: newDeadline });
      }
      return next;
    });
  };

  const bulkAssignMutation = useMutation({
    mutationFn: (assignments) =>
      bulkAssignActivities({
        assistanceId: employee.attendance.id,
        assignments,
      }),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message, { id: "bulk-assign" });
      } else {
        queryClient.invalidateQueries({ queryKey: ["employees-attendance", scheduleId] });
        toast.success(data?.message || "Actividades asignadas exitosamente.", {
          id: "bulk-assign",
        });
        handleClose();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error inesperado.", { id: "bulk-assign" });
    },
  });

  const handleAssign = () => {
    const assignmentsToProcess = Array.from(selectedActivities.entries())
      .filter(([_, data]) => data.selected)
      .map(([id, data]) => ({
        activitie_id: id,
        deadline: data.deadline,
      }));

    if (assignmentsToProcess.length === 0) {
      toast.warning("Debes seleccionar al menos una actividad para asignar.");
      return;
    }

    bulkAssignMutation.mutate(assignmentsToProcess);
  };

  const handleInventActivity = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const description = formData.get("description") || "Actividad creada sobre la marcha";
    const default_deadline = formData.get("deadline") || "12:00";

    if (!name) {
      toast.warning("El nombre de la actividad es obligatorio.");
      return;
    }
    
    if (!primaryAreaId || !primaryRoleId) {
      toast.error("El empleado debe tener un área y rol asignados para crearle una actividad.");
      return;
    }

    setIsCreating(true);
    const result = await createActivity({
      name,
      description,
      area_id: primaryAreaId,
      job_role_id: primaryRoleId,
      default_deadline,
    });

    if (result?.error) {
      toast.error(result.error.message);
      setIsCreating(false);
      return;
    }

    toast.success("Actividad extra creada. Refrescando...");
    // Invalidate the role activities query so it fetches the new activity
    queryClient.invalidateQueries({ queryKey: ["jobRoleActivities", primaryRoleId] });
    e.target.reset();
    setIsCreating(false);
    // Optionally switch back to the main tab by closing the extra panel
    setShowExtra(false);
  };

  const selectedCount = Array.from(selectedActivities.values()).filter((a) => a.selected).length;

  return (
    <div className="flex flex-col w-full bg-background mt-4 rounded-xl border border-border/40 overflow-hidden shadow-sm">
      <div className="p-4 bg-muted/20 border-b border-border/40">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileStack className="size-5 text-sidebar-primary" /> Actividades del Rol
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Estas son las actividades predeterminadas para el rol de{" "}
          <strong className="text-foreground">{employee?.roles?.[0]?.name || "Sin Rol"}</strong>.
        </p>
      </div>

      <div className="flex-1 p-4 max-h-[40vh] overflow-y-auto">
        {!primaryRoleId ? (
          <div className="p-4 text-center text-muted-foreground">
            El empleado no tiene un rol asignado.
          </div>
        ) : isLoadingActivities ? (
          <div className="flex justify-center p-8">
            <div className="size-6 border-2 border-sidebar-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activitiesData?.data?.length > 0 ? (
          <div className="space-y-3">
            {activitiesData.data.map((activity) => {
              const isAlreadyAssigned = employee.attendance.activities.some(
                (a) => a.activity.id === activity.id
              );
              const isSelected = selectedActivities.get(activity.id)?.selected || false;
              const deadline = selectedActivities.get(activity.id)?.deadline || "12:00";

              return (
                <div
                  key={activity.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                    isAlreadyAssigned
                      ? "bg-muted/40 border-border/30 opacity-70"
                      : isSelected
                      ? "bg-sidebar-primary/5 border-sidebar-primary/20 shadow-sm"
                      : "bg-card border-border/50 hover:border-border"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id={`role-act-${activity.id}`}
                      checked={isAlreadyAssigned ? true : isSelected}
                      disabled={isAlreadyAssigned || bulkAssignMutation.isPending}
                      onCheckedChange={() => handleToggleActivity(activity.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`role-act-${activity.id}`}
                        className="font-semibold text-[14px] leading-tight cursor-pointer"
                      >
                        {activity.name}
                      </Label>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {activity.description}
                        </p>
                      )}
                      {isAlreadyAssigned && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-[10px] uppercase text-emerald-600 bg-emerald-50 border-emerald-200"
                        >
                          Asignada
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!isAlreadyAssigned && isSelected && (
                    <div className="w-28 shrink-0">
                      <Input
                        type="time"
                        value={deadline}
                        onChange={(e) => handleDeadlineChange(activity.id, e.target.value)}
                        disabled={bulkAssignMutation.isPending}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Este rol no tiene actividades base configuradas.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground font-medium">
          {selectedCount} actividad(es) seleccionada(s)
        </div>
        <Button
          onClick={handleAssign}
          disabled={!primaryRoleId || selectedCount === 0 || bulkAssignMutation.isPending}
          className="w-full sm:w-auto gap-2 shadow-sm"
        >
          {bulkAssignMutation.isPending ? (
            <>
              <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              Asignando...
            </>
          ) : (
            <>
              <CopyPlus className="size-4" /> Asignar Seleccionadas
            </>
          )}
        </Button>
      </div>

      <div className="border-t border-border/40">
        <button
          type="button"
          onClick={() => setShowExtra(!showExtra)}
          className="w-full p-3 flex items-center justify-center gap-2 text-sm font-medium text-sidebar-primary hover:bg-sidebar-primary/5 transition-colors"
        >
          <Plus className="size-4" /> Añadir actividad extra
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              showExtra ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {showExtra && (
        <div className="p-4 border-t border-border/40 bg-card animate-in slide-in-from-top-2">
          <Tabs defaultValue="invent">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="invent">Inventar Actividad</TabsTrigger>
              <TabsTrigger value="catalog">Catálogo General</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invent" className="space-y-4">
              <form onSubmit={handleInventActivity} className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <Label>Nombre de la Actividad Extra</Label>
                  <Input name="name" placeholder="Ej. Limpiar almacén especial" required />
                </div>
                <div className="space-y-1">
                  <Label>Descripción (Opcional)</Label>
                  <Textarea name="description" placeholder="Instrucciones breves..." className="resize-none h-16" />
                </div>
                <div className="space-y-1">
                  <Label>Hora límite sugerida</Label>
                  <Input type="time" name="deadline" defaultValue="15:00" />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full gap-2 mt-2">
                  {isCreating ? (
                    <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Crear y añadir a la lista
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="catalog">
              <div className="bg-muted/10 p-2 rounded-xl border border-border/40">
                <Areas scheduleId={scheduleId} employee={employee} handleClose={handleClose} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
