"use client";

import * as React from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRound, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { getEmployees } from "@/lib/queries";
import { assignEmployeesToArea } from "@/lib/mutations";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Subtitle } from "@/components/subtitle";
import { RenderData } from "@/components/render-data";
import { ClientSearch } from "@/components/client-search";
import { ClientPagination } from "@/components/client-pagination";

export function SelectUsers({ area, onCancel }) {
  const [selectedEmployees, setSelectedEmployees] = React.useState(new Map());
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openAction, setOpenAction] = React.useState(false);

  const queryClient = useQueryClient();
  const { page, handlePreviousPage, handleNextPage, handleChangePage, handleResetPagination } =
    usePagination();
  const { search, handleSearch } = useSearch({ onSearch: handleResetPagination });

  const { isPending, isError, data } = useQuery({
    queryKey: ["employees", page, search],
    queryFn: () => getEmployees({ page, q: search }),
    placeholderData: keepPreviousData,
  });
  const assignEmployees = useMutation({
    mutationFn: ({ area, addedEmployees, removedEmployees }) =>
      assignEmployeesToArea({ area, addedEmployees, removedEmployees }),
  });

  const addedEmployees = React.useRef(new Map());
  const removedEmployees = React.useRef(new Map());

  const hasChanged = addedEmployees.current.size > 0 || removedEmployees.current.size > 0;

  function handleSelectEmployee(employee) {
    return function (checked) {
      const hasArea = employee.areas.some(({ id }) => id === area);

      if (!hasArea && checked) {
        addedEmployees.current.set(employee.id, true);
      } else if (hasArea && !checked) {
        removedEmployees.current.set(employee.id, true);
      } else if (!hasArea && !checked) {
        addedEmployees.current.delete(employee.id);
      } else if (hasArea && checked) {
        removedEmployees.current.delete(employee.id);
      }

      setSelectedEmployees((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(employee.id, checked);
        return newMap;
      });
    };
  }

  function handleCancel() {
    setOpenCancel(false);
    onCancel();
  }

  function handleSubmit() {
    if (!hasChanged) return;

    assignEmployees.mutate(
      {
        area,
        addedEmployees: [...addedEmployees.current.keys()],
        removedEmployees: [...removedEmployees.current.keys()],
      },
      {
        onSuccess: () => {
          setOpenAction(false);
          addedEmployees.current.clear();
          removedEmployees.current.clear();
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          toast.success("Empleados asignados exitosamente al área de trabajo.", {
            id: "assign-employees-to-area",
          });
        },
        onError: (error) => {
          toast.error(error.message, { id: "assign-employees-to-area" });
        },
      }
    );
  }

  React.useEffect(() => {
    if (!data) return;

    const employees = new Map();

    for (let i = 0; i < data.data.length; i++) {
      const hasArea = data.data[i].areas.some(({ id }) => id === area);

      if (hasArea) employees.set(data.data[i].id, true);
    }

    setSelectedEmployees(employees);
  }, [data, area, setSelectedEmployees]);

  return (
    <div className="space-y-4">
      <div className="max-w-prose">
        <Subtitle className="font-normal items-baseline">
          <UsersRound /> Empleados
        </Subtitle>
        <p className="text-muted-foreground  text-sm">
          Selecciona los empleados que deseas asignar al área. Puedes desmarcar aquellos que ya no
          deberían pertenecer.
        </p>
        <p className="text-muted-foreground leading-tight text-sm">
          Finalmente revisa los cambios y confirma la asignación de empleados para el área
          seleccionada.
        </p>
      </div>

      <ClientSearch placeholder="Buscar por nombre" search={search} onSearch={handleSearch} />

      <RenderData
        isPending={isPending}
        isError={isError}
        data={data}
        Component={({ data }) => (
          <div className="space-y-4">
            <ul className="space-y-4">
              {data.data.map((employee) => (
                <li key={employee.id} className="flex items-center gap-4">
                  <Checkbox
                    id={employee.id}
                    checked={
                      (!!selectedEmployees.get(employee.id) &&
                        !removedEmployees.current.get(employee.id)) ||
                      !!addedEmployees.current.get(employee.id)
                    }
                    onCheckedChange={handleSelectEmployee(employee)}
                  />
                  <div className="flex gap-4">
                    <Avatar className="size-9 shadow-sm shrink-0 object-cover aspect-square">
                      <AvatarImage
                        src={employee.image ?? "/user-round.svg"}
                        className="size-9 shadow-sm shrink-0 object-cover aspect-square"
                      />
                      <AvatarFallback className="size-9 shadow-sm shrink-0 object-cover aspect-square">
                        <UserRound />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-none">
                      <label
                        htmlFor={employee.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {employee.fullName}
                      </label>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
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

            <div className="flex justify-end items-center gap-4">
              <Button
                disabled={assignEmployees.isPending}
                onClick={() => {
                  if (hasChanged) setOpenCancel(true);
                  else handleCancel();
                }}
                variant="secondary"
                className="grow md:grow-0"
              >
                Cancelar
              </Button>
              <Button
                disabled={assignEmployees.isPending}
                onClick={() => {
                  if (hasChanged) setOpenAction(true);
                  else
                    toast.info(
                      "No has realizado ninguna modificación, por lo tanto, no puedes continuar con esta acción.",
                      {
                        id: "assign-user",
                      }
                    );
                }}
                className="grow md:grow-0"
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      />

      <AlertDialog open={openCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas descartar los cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Los cambios realizados no se han guardado. Si sales ahora, se perderán. ¿Quieres
              continuar sin guardar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenCancel(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openAction}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas confirmar los cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de asignar {addedEmployees.current.size} usuario(s) al área de trabajo y
              remover {removedEmployees.current.size} usuario(s).
            </AlertDialogDescription>
            <AlertDialogDescription>
              Confirma si deseas continuar con esta acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAction(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
