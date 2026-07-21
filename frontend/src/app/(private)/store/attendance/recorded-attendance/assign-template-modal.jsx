"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CopyPlus, FileStack } from "lucide-react";

import { getJobRoles, getJobRoleActivities } from "@/lib/queries";
import { bulkAssignActivities } from "@/actions/activities";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AssignTemplateModal({ employee, scheduleId }) {
  const [open, setOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(null);
  
  const [selectedActivities, setSelectedActivities] = React.useState(new Map());

  const queryClient = useQueryClient();

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedRole(null);
      setSelectedActivities(new Map());
    }
  }, [open]);

  const { data: jobRolesData, isPending: isLoadingRoles } = useQuery({
    queryKey: ["jobRoles"],
    queryFn: () => getJobRoles({ limit: 100 }),
    enabled: open,
  });

  const { data: activitiesData, isPending: isLoadingActivities } = useQuery({
    queryKey: ["jobRoleActivities", selectedRole],
    queryFn: () => getJobRoleActivities({ jobRoleId: selectedRole, limit: 100 }),
    enabled: !!selectedRole && open,
  });

  // Automatically select all activities when data changes
  React.useEffect(() => {
    if (activitiesData?.data) {
      const initialMap = new Map();
      activitiesData.data.forEach((activity) => {
        // Find existing assigned activity if any
        const existingAssigned = employee.attendance.activities.find(
          (a) => a.activity.id === activity.id
        );
        
        if (!existingAssigned) {
           initialMap.set(activity.id, {
             selected: true,
             deadline: activity.default_deadline || "12:00"
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
    mutationFn: (assignments) => bulkAssignActivities({ 
      assistanceId: employee.attendance.id, 
      assignments 
    }),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message, { id: "bulk-assign" });
      } else {
        queryClient.invalidateQueries({ queryKey: ["employees-attendance", scheduleId] });
        toast.success(data?.message || "Actividades asignadas exitosamente.", {
          id: "bulk-assign",
        });
        setOpen(false);
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

  const selectedCount = Array.from(selectedActivities.values()).filter(a => a.selected).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 shadow-sm rounded-xl">
          <FileStack className="size-4 text-sidebar-primary" />
          <span className="font-semibold text-foreground/90">Asignar actividades por Rol</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col p-0 rounded-2xl overflow-hidden border-border/40">
        <div className="p-6 pb-4 border-b border-border/40 bg-muted/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-sidebar-primary">
              <FileStack className="size-5" /> Plantillas de Trabajo
            </DialogTitle>
            <DialogDescription className="text-foreground/70 leading-relaxed mt-2">
              Asigna de forma rápida las actividades predeterminadas correspondientes al rol
              de trabajo de <strong>{employee?.fullName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2 block">
              Seleccionar Rol de Trabajo
            </Label>
            <Select
              value={selectedRole ? String(selectedRole) : undefined}
              onValueChange={(val) => setSelectedRole(Number(val))}
              disabled={isLoadingRoles}
            >
              <SelectTrigger className="w-full bg-background border-border/50 shadow-sm rounded-xl h-11">
                <SelectValue placeholder={isLoadingRoles ? "Cargando roles..." : "Elige un rol..."} />
              </SelectTrigger>
              <SelectContent>
                {jobRolesData?.data?.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedRole && (
          <div className="flex-1 overflow-hidden flex flex-col bg-background/50">
            {isLoadingActivities ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
                <div className="size-8 border-4 border-sidebar-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">Cargando actividades del rol...</p>
              </div>
            ) : activitiesData?.data?.length > 0 ? (
              <div className="flex-1 p-6 h-full overflow-y-auto">
                <div className="space-y-4 pr-2">
                  {activitiesData.data.map((activity) => {
                    // Check if already assigned
                    const isAlreadyAssigned = employee.attendance.activities.some(
                      (a) => a.activity.id === activity.id
                    );
                    const isSelected = selectedActivities.get(activity.id)?.selected || false;
                    const deadline = selectedActivities.get(activity.id)?.deadline || "12:00";

                    return (
                      <div
                        key={activity.id}
                        className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-300 ${
                          isAlreadyAssigned
                            ? "bg-muted/40 border-border/30 opacity-60"
                            : isSelected
                            ? "bg-sidebar-primary/5 border-sidebar-primary/20 shadow-sm"
                            : "bg-card border-border/50 hover:border-border"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            id={`chk-${activity.id}`}
                            checked={isAlreadyAssigned ? true : isSelected}
                            disabled={isAlreadyAssigned || bulkAssignMutation.isPending}
                            onCheckedChange={() => handleToggleActivity(activity.id)}
                            className="mt-1"
                          />
                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`chk-${activity.id}`}
                              className="font-semibold text-[15px] leading-tight cursor-pointer"
                            >
                              {activity.name}
                            </Label>
                            {activity.description && (
                              <p className="text-sm text-foreground/70 leading-relaxed max-w-lg">
                                {activity.description}
                              </p>
                            )}
                            {isAlreadyAssigned && (
                              <Badge variant="outline" className="mt-2 text-[10px] uppercase text-emerald-600 bg-emerald-50 border-emerald-200">
                                Ya asignada
                              </Badge>
                            )}
                          </div>
                        </div>

                        {!isAlreadyAssigned && isSelected && (
                          <div className="sm:w-32 shrink-0">
                            <Label className="text-xs text-muted-foreground mb-1.5 block">
                              Hora Límite
                            </Label>
                            <Input
                              type="time"
                              value={deadline}
                              onChange={(e) => handleDeadlineChange(activity.id, e.target.value)}
                              disabled={bulkAssignMutation.isPending}
                              className="h-9 bg-background"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
                <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center">
                  <FileStack className="size-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">No hay actividades</h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Este rol no tiene actividades base configuradas.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="p-4 border-t border-border/40 bg-muted/10 flex items-center justify-between sm:justify-between gap-4">
          <div className="text-sm text-muted-foreground font-medium hidden sm:block">
            {selectedRole && !isLoadingActivities ? (
              <span>{selectedCount} actividad(es) seleccionada(s)</span>
            ) : (
              <span className="opacity-0">.</span>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={bulkAssignMutation.isPending}
              className="flex-1 sm:flex-none h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedRole || selectedCount === 0 || bulkAssignMutation.isPending}
              className="flex-1 sm:flex-none gap-2 shadow-md hover:shadow-lg h-11"
            >
              {bulkAssignMutation.isPending ? (
                <>
                  <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Asignando...
                </>
              ) : (
                <>
                  <CopyPlus className="size-4" />
                  Asignar Todas
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
