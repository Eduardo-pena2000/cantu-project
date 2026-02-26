"use client";

import * as React from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, UserCheck, UserRound, UserX } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { getAllEmployees } from "@/lib/queries";
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

export function AllEmployees({
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
    queryKey: ["all-employees", page, search],
    queryFn: () => getAllEmployees({ page, q: search }),
    placeholderData: keepPreviousData,
    enabled: open && !!attendance,
  });

  const takeAttendance = useMutation({
    mutationFn: (formData) => takeEmployeeAttendance(formData),
  });

  function handleOpen(value) {
    if (value) {
      onOpenChange("all");
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
        open={open === "all"}
        onOpenChange={handleOpen}
        className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden group/collapse"
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/30 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Catálogo</span>
            <span className="text-foreground/90 font-medium">Todos los empleados registrados</span>
          </div>
          <div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="justify-between bg-background/50 hover:bg-muted/50 border-border/40 shadow-sm transition-all duration-300 rounded-xl group-data-[state=open]/collapse:bg-sidebar-primary/10 group-data-[state=open]/collapse:text-sidebar-primary group-data-[state=open]/collapse:border-sidebar-primary/30">
                <span className="mr-2">Listar todos los empleados</span>
                <ChevronsUpDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapse:rotate-180" />
                <span className="sr-only">Listar todos los empleados</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="mt-6 pt-6 border-t border-border/40">
          <div className="space-y-6">
            <ClientSearch className="w-full bg-background/50 shadow-inner border-border/80 focus-within:ring-2 focus-within:ring-sidebar-primary/20 transition-all rounded-lg" placeholder="Buscar por nombre..." search={search} onSearch={handleSearch} />

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
                            "bg-card/80 backdrop-blur-md border border-border/50 p-4 rounded-2xl grid gap-4 relative overflow-hidden transition-all duration-300 group hover:shadow-md",
                            !!employeeAttendance ? "opacity-60 grayscale-[0.5]" : "shadow-sm"
                          )}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sidebar-primary/40 group-hover:bg-sidebar-primary transition-colors" />
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 pl-2">
                            <div className="flex items-center gap-4">
                              <Avatar className="shadow-md size-11 ring-2 ring-background shrink-0 object-cover aspect-square transition-transform group-hover:scale-105">
                                <AvatarImage
                                  src={employee.image}
                                  className="size-11 shrink-0 object-cover aspect-square"
                                />
                                <AvatarFallback className="size-11 shrink-0 object-cover aspect-square bg-sidebar-primary/10 text-sidebar-primary">
                                  <UserRound className="size-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col leading-none space-y-1">
                                <span className="text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-sidebar-primary">
                                  {employee.fullName}
                                </span>
                                <p className="text-xs text-muted-foreground font-medium">{employee.email}</p>
                              </div>
                            </div>
                            {!employeeAttendance && (
                              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border/40">
                                <Button
                                  onClick={handleOpenModal(employee)}
                                  disabled={
                                    takeAttendance.isPending &&
                                    Number(takeAttendance.variables.get("employee_id")) ===
                                    employee.id
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 sm:flex-none text-destructive hover:text-destructive-foreground hover:bg-destructive hover:border-destructive shadow-sm transition-all duration-300 rounded-xl disabled:opacity-100 disabled:animate-pulse"
                                >
                                  <UserX className="mr-2 size-4" /> Falta
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
                                    size="sm"
                                    className="flex-1 sm:flex-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-xl disabled:opacity-100 disabled:animate-pulse"
                                  >
                                    <UserCheck className="mr-2 size-4" /> Presente
                                  </Button>
                                </Webcam>
                              </div>
                            )}
                          </div>
                          {!!employeeAttendance && (
                            <div className="pl-2 pt-3 border-t border-border/40 mt-1 flex items-center gap-2 w-fit">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <p className="text-[13px] text-foreground font-medium">
                                Asistencia: <span className="font-bold text-foreground capitalize">{employeeAttendance.attendance.status}</span>
                              </p>
                            </div>
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
