"use client";

import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserCheck, UserRound, UsersRound } from "lucide-react";

import { getEmployeesWithoutTeam, getTeamById } from "@/lib/queries";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Subtitle } from "@/components/subtitle";
import { RenderData } from "@/components/render-data";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";
import { Badge } from "@/components/ui/badge";
import { AddUser } from "./add-user";
import { RemoveUser } from "./remove-user";
import { UserSchedule } from "./user-schedule";

export function SelectUsers({ teamId }) {
  const [selectedEmployees, setSelectedEmployees] = React.useState(new Map());

  const { page, handlePreviousPage, handleNextPage, handleChangePage, handleResetPagination } =
    usePagination();
  const { search, handleSearch } = useSearch({ onSearch: handleResetPagination });

  const {
    isPending: isPendingTeamData,
    isError: isErrorTeamData,
    data: teamData,
  } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamById(teamId),
    enabled: !!teamId,
  });
  const {
    isPending: isPendingEmployeesData,
    isError: isErrorEmployeesData,
    data: employeesData,
  } = useQuery({
    queryKey: ["employees-without-team", teamId],
    queryFn: () => getEmployeesWithoutTeam(teamId),
    placeholderData: keepPreviousData,
    enabled: !!teamData,
  });

  React.useEffect(() => {
    if (!teamData || !employeesData) return;

    const employees = new Map();

    for (let i = 0; i < teamData.data.users.length; i++) {
      const employee = teamData.data.users[i];

      employees.set(employee.id, employee);
    }

    setSelectedEmployees(employees);
  }, [teamData, employeesData, setSelectedEmployees]);

  return (
    <div className="space-y-4">
      <div className="max-w-prose">
        <Subtitle className="font-normal items-baseline">
          <UsersRound /> Empleados
        </Subtitle>
        <p className="text-muted-foreground  text-sm">
          Selecciona los empleados que deseas asignar al equipo de trabajo. Puedes desmarcar
          aquellos que ya no deberían pertenecer.
        </p>
        <p className="text-muted-foreground leading-tight text-sm">
          Finalmente revisa los cambios y confirma la asignación de empleados para el equipo de
          trabajo seleccionado.
        </p>
      </div>

      <ClientSearch placeholder="Buscar por nombre" search={search} onSearch={handleSearch} />

      <RenderData
        isPending={isPendingTeamData || isPendingEmployeesData}
        isError={isErrorTeamData || isErrorEmployeesData}
        data={employeesData}
        Component={({ data }) => (
          <div className="space-y-4">
            <ul className="space-y-4">
              {data.data?.map((employee) => (
                <li
                  key={employee.id}
                  className="bg-primary-foreground shadow p-4 rounded-lg grid gap-4"
                >
                  <div className="flex gap-4">
                    <Avatar className="bg-accent size-9 shadow-sm shrink-0 object-cover aspect-square">
                      <AvatarImage
                        src={employee.image ?? "/user-round.svg"}
                        className="size-9 shadow-sm shrink-0 object-cover aspect-square"
                      />
                      <AvatarFallback className="size-9 shadow-sm shrink-0 object-cover aspect-square">
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

                  {selectedEmployees.get(employee.id) && (
                    <div>
                      <div className="text-green-600 text-sm flex items-baseline-last gap-1.5 mb-2">
                        <UserCheck className="size-4" /> Miembro del equipo
                      </div>
                      <div className="w-full flex flex-wrap gap-1.5">
                        {selectedEmployees.get(employee.id).schedules.map((schedule) => (
                          <Badge key={schedule.id} variant="default">
                            {schedule.day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    {selectedEmployees.get(employee.id) ? (
                      <>
                        <RemoveUser teamId={teamId} employeeId={employee.id} />
                        <UserSchedule
                          teamId={teamId}
                          employeeId={employee.id}
                          schedules={teamData?.data?.shift?.schedules}
                          employeeSchedule={selectedEmployees.get(employee.id)?.schedules ?? []}
                        />
                      </>
                    ) : (
                      <AddUser
                        teamId={teamId}
                        employeeId={employee.id}
                        schedules={teamData?.data?.shift?.schedules}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* <ClientPagination
              className='md:justify-end'
              totalPages={data.pagination.lastPage}
              currentPage={page}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              onChangePage={handleChangePage}
            /> */}
          </div>
        )}
      />
    </div>
  );
}
