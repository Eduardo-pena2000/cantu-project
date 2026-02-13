"use client";

import * as React from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, UserCheck, UserRound, UserX } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { getEmployeesByScheduleId } from "@/lib/queries";
import { takeEmployeeAttendance } from "@/lib/mutations";
import { ATTENDANCE_STATUS } from "@/data/constants";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AbsentAttendance } from "@/app/(private)/store/attendance/record-attendance/absent-attendance";
import { Webcam } from "@/components/web-cam";
import { RenderData } from "@/components/render-data";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";

export function ScheduleEmployees({
  open,
  onOpenChange,
  storeId,
  teamId,
  scheduleId,
  isPendingAttendance,
  isErrorAttendance,
  attendance,
}) {
  const [openModal, setOpenModal] = React.useState(false);
  const [employee, setEmployee] = React.useState(null);

  const queryClient = useQueryClient();
  const { page, handlePreviousPage, handleNextPage, handleChangePage, handleResetPagination } =
    usePagination();
  const { search, handleSearch } = useSearch({ onSearch: handleResetPagination });

  const { isPending, isError, data } = useQuery({
    queryKey: ["schedule-employees", scheduleId, page, search],
    queryFn: () => getEmployeesByScheduleId({ scheduleId, page, q: search }),
    placeholderData: keepPreviousData,
    enabled: open && !!attendance,
  });

  const takeAttendance = useMutation({
    mutationFn: (formData) => takeEmployeeAttendance(formData),
  });

  function handleOpen(value) {
    if (value) {
      onOpenChange("team");
    } else {
      onOpenChange("none");
    }
  }

  function handleOpenModal(employee) {
    return function () {
      setEmployee(employee);
      setOpenModal(true);
    };
  }

  async function handleTakeAttendance({ employee, status, observations, image }) {
    const data = new FormData();
    data.append("store_id", storeId);
    data.append("team_id", teamId);
    data.append("employee_id", employee.id);
    data.append("schedule_id", scheduleId);
    data.append("status", status);

    if (observations && observations.trim()) {
      data.append("observations", observations);
    }
    if (image) {
      const blob = await fetch(image).then((res) => res.blob());
      data.append("image", blob);
    }

    takeAttendance.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees-attendance", scheduleId] });
        if (openModal) {
          setOpenModal(false);
        }
        toast.success(
          `La asistencia del empleado ${employee.shortFullName} ha sido registrada exitosamente.`
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  function handleTakeImage(employee) {
    return function (img) {
      handleTakeAttendance({
        employee,
        status: ATTENDANCE_STATUS.PRESENT,
        image: img,
      });
    };
  }

  return (
    <>
      <Collapsible
        open={open === "team"}
        onOpenChange={handleOpen}
        className="rounded-md border p-4"
      >
        <div className="text-sm flex flex-col">
          <span className="text-sm font-semibold line-clamp-1">Equipo</span>
          <div>
            <CollapsibleTrigger asChild>
              <Button variant="text" size="txt" className="justify-between">
                <ChevronsUpDown />
                <span>Listar equipo de trabajo</span>
                <span className="sr-only">Listar equipo de trabajo</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="space-y-4">
            <ClientSearch placeholder="Buscar por nombre" search={search} onSearch={handleSearch} />

            <RenderData
              isPending={isPendingAttendance || isPending}
              isError={isErrorAttendance || isError}
              data={data}
              Component={({ data }) => (
                <div className="space-y-4">
                  <ul className="flex flex-col gap-4">
                    {data.data.map((employee) => {
                      const employeeAttendance = attendance.get(employee.id);

                      return (
                        <li
                          key={employee.id}
                          className={cn(
                            "border p-3 rounded-md grid gap-3",
                            !!employeeAttendance && "bg-accent opacity-70"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                            <div className="flex items-center gap-4">
                              <Avatar className="shadow size-9 shrink-0 object-cover aspect-square">
                                <AvatarImage
                                  src={employee.image}
                                  className="size-9 shrink-0 object-cover aspect-square"
                                />
                                <AvatarFallback className="size-9 shrink-0 object-cover aspect-square">
                                  <UserRound />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col leading-none">
                                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {employee.fullName}
                                </span>
                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                              </div>
                            </div>
                            {!employeeAttendance && (
                              <div className="flex gap-4">
                                <Button
                                  onClick={handleOpenModal(employee)}
                                  disabled={
                                    takeAttendance.isPending &&
                                    Number(takeAttendance.variables.get("employee_id")) ===
                                      employee.id
                                  }
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-background disabled:opacity-100 disabled:animate-pulse"
                                >
                                  <UserX />
                                </Button>
                                <Webcam
                                  title="Tomar evidencia"
                                  description={`
                                    Captura una imagen que sirva como evidencia de la asistencia del empleado.
                                    Asegúrate de que la foto refleje claramente a la persona.
                                  `}
                                  image={null}
                                  onTakeImage={handleTakeImage(employee)}
                                >
                                  <Button
                                    disabled={
                                      takeAttendance.isPending &&
                                      Number(takeAttendance.variables.get("employee_id")) ===
                                        employee.id
                                    }
                                    size="icon"
                                    className="disabled:opacity-100 disabled:animate-pulse"
                                  >
                                    <UserCheck />
                                  </Button>
                                </Webcam>
                              </div>
                            )}
                          </div>
                          {!!employeeAttendance && (
                            <p className="text-sm text-muted-foreground font-semibold">
                              Asistencia registrada: {employeeAttendance.attendance.status}
                            </p>
                          )}
                        </li>
                      );
                    })}
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
        </CollapsibleContent>
      </Collapsible>

      <AbsentAttendance
        open={openModal}
        onOpenChange={setOpenModal}
        onClose={() => setEmployee(null)}
        handleTakeAttendance={handleTakeAttendance}
        employee={employee}
        disabled={
          takeAttendance.isPending &&
          Number(takeAttendance.variables.get("employee_id")) === employee?.id
        }
      />
    </>
  );
}
