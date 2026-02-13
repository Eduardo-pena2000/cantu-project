"use client";

import * as React from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getAreaActivities } from "@/lib/queries";
import {
  assignActivityToEmployee,
  editAssignedActivityToEmployee,
  removeAssignedActivityToEmployee,
} from "@/lib/mutations";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";
import { RenderData } from "@/components/render-data";
import { RemoveAssignedActivity } from "./remove-assigned-activity";

export function AreaActivities({ areaId, scheduleId, employee }) {
  const [selectedActivities, setSelectedActivities] = React.useState(new Map());
  const employeeActivities = new Map(
    employee.attendance.activities.map((assignedActivity) => [
      assignedActivity.activity.id,
      assignedActivity,
    ])
  );

  const queryClient = useQueryClient();
  const {
    page,
    handlePreviousPage,
    handleNextPage,
    handleChangePage,
    handleResetPagination,
    containerRef,
  } = usePagination();
  const { search, handleSearch } = useSearch({ onSearch: handleResetPagination });

  const { isPending, isError, data } = useQuery({
    queryKey: ["area-activities", areaId, page, search],
    queryFn: () => getAreaActivities({ areaId, page, q: search }),
    placeholderData: keepPreviousData,
  });

  const assignActivity = useMutation({
    mutationFn: ({ attendanceId, activityId, deadline }) =>
      assignActivityToEmployee({ attendanceId, activityId, deadline }),
  });

  const editAssignedActivity = useMutation({
    mutationFn: ({ assignedActivityId, deadline }) =>
      editAssignedActivityToEmployee({ assignedActivityId, deadline }),
  });

  const removeAssignedActivity = useMutation({
    mutationFn: ({ assignedActivityId }) =>
      removeAssignedActivityToEmployee({ assignedActivityId }),
  });

  function handleSelectActivity(activityId) {
    return function (value) {
      if (value && !employeeActivities.has(activityId)) {
        setSelectedActivities((prevState) => {
          const newMap = new Map(prevState);
          newMap.set(activityId, true);
          return newMap;
        });
      } else if (!value && !employeeActivities.has(activityId)) {
        setSelectedActivities((prevState) => {
          const newMap = new Map(prevState);
          newMap.delete(activityId);
          return newMap;
        });
      }
    };
  }

  function handleAssignActivity(attendanceId, activityId) {
    return function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const deadline = formData.get("deadline");

      if (!deadline || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(deadline)) {
        toast.warning("Ingresa una hora límite válida para esta actividad.", {
          id: "deadline-warning",
        });
      } else {
        assignActivity.mutate(
          { attendanceId, activityId, deadline },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["employees-attendance", scheduleId] });
              toast.success("La actividad ha sido asignada exitosamente.", {
                id: "assign-activity",
              });
            },
            onError: (error) => {
              toast.error(error.message, { id: "assign-activity" });
            },
          }
        );
      }
    };
  }

  function handleEditAssignedActivity(assignedActivityId) {
    return function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const deadline = formData.get("deadline");

      if (!deadline || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(deadline)) {
        toast.warning("Ingresa una hora límite válida para esta actividad.", {
          id: "deadline-warning",
        });
      } else {
        editAssignedActivity.mutate(
          { assignedActivityId, deadline },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["employees-attendance", scheduleId] });
              toast.success("La actividad asignada ha sido actualizada exitosamente.", {
                id: "edit-assigned-activity",
              });
            },
            onError: (error) => {
              toast.error(error.message, { id: "edit-assigned-activity" });
            },
          }
        );
      }
    };
  }

  function handleRemoveAssignedActivity(cb, assignedActivityId) {
    return function () {
      removeAssignedActivity.mutate(
        { assignedActivityId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees-attendance", scheduleId] });
            toast.success("La actividad asignada ha sido eliminada exitosamente.", {
              id: "remove-assigned-activity",
            });
            cb();
          },
          onError: (error) => {
            toast.error(error.message, { id: "remove-assigned-activity" });
          },
        }
      );
    };
  }

  return (
    <>
      <div ref={containerRef} className="space-y-2">
        <ClientSearch placeholder="Buscar actividad" search={search} onSearch={handleSearch} />

        <RenderData
          isPending={isPending}
          isError={isError}
          data={data}
          Component={({ data }) => (
            <div className="space-y-2">
              <ul className="flex flex-col gap-2">
                {data.data.map((activity) => (
                  <li key={activity.id} className="rounded-md border p-4 space-y-2">
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <Checkbox
                        checked={
                          employeeActivities.has(activity.id) || selectedActivities.has(activity.id)
                        }
                        onCheckedChange={handleSelectActivity(activity.id)}
                        id={activity.id}
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor={activity.id} className="max-w-prose font-semibold">
                          {activity.name}
                        </Label>
                        <p className="max-w-prose text-sm">{activity.description}</p>
                      </div>
                    </div>
                    {selectedActivities.has(activity.id) && (
                      <form
                        onSubmit={handleAssignActivity(employee.attendance.id, activity.id)}
                        className="space-y-2"
                      >
                        <Label>Hora límite</Label>
                        <div className="flex justify-between items-center gap-2">
                          <Input type="time" name="deadline" className="shrink-0 w-32" />
                          <Button type="submit">Confirmar</Button>
                        </div>
                      </form>
                    )}
                    {employeeActivities.has(activity.id) && (
                      <EmployeeActivityForm
                        handleEditAssignedActivity={handleEditAssignedActivity}
                        handleRemoveAssignedActivity={handleRemoveAssignedActivity}
                        assignedActivityId={employeeActivities.get(activity.id).id}
                        deadline={employeeActivities.get(activity.id).deadline}
                      />
                    )}
                  </li>
                ))}
              </ul>

              <ClientPagination
                className="md:justify-end"
                totalPages={data.pagination.lastPage}
                currentPage={page}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onChangePage={handleChangePage}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}

function EmployeeActivityForm({
  handleEditAssignedActivity,
  handleRemoveAssignedActivity,
  assignedActivityId,
  deadline,
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const formRef = React.useRef(null);

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    if (formRef.current !== null) {
      formRef.current.requestSubmit();
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Hora límite</Label>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <form ref={formRef} onSubmit={handleEditAssignedActivity(assignedActivityId)}>
            <Input
              disabled={!isEditing}
              type="time"
              name="deadline"
              defaultValue={deadline}
              className="shrink-0 w-32"
            />
          </form>
          {!isEditing ? (
            <div className="flex items-center gap-2">
              <Button onClick={() => setOpen(true)} variant="destructive" size="icon">
                <Trash2 />
              </Button>
              <Button onClick={() => setIsEditing(true)} size="icon">
                <Pencil />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsEditing(false)} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Confirmar</Button>
            </div>
          )}
        </div>
      </div>

      <RemoveAssignedActivity
        handleRemoveAssignedActivity={handleRemoveAssignedActivity(handleClose, assignedActivityId)}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
