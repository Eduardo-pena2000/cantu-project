import { z } from "zod";

import { getDateFromDateInput } from "@/utils";

export const editTeamSchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
  shift_id: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number({
        required_error: "Este campo es requerido.",
        invalid_type_error: "Ingresa un turno de trabajo válido.",
      })
      .positive("Este campo es requerido.")
  ),
  manager_id: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number({ invalid_type_error: "Ingresa un turno de trabajo válido." })
      .positive("Este campo es requerido.")
      .optional()
  ),
  temporal_manager: z
    .object({
      id: z.coerce.number().positive("Este campo es requerido."),
      start_date: z
        .string()
        .trim()
        .length(10, "Este campo es requerido.")
        .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Ingresa una fecha válida."),
      end_date: z
        .string()
        .trim()
        .length(10, "Este campo es requerido.")
        .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Ingresa una fecha válida."),
    })
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (val === null) return true;

        const startDate = getDateFromDateInput(val.start_date);
        const endDate = getDateFromDateInput(val.end_date);

        return endDate >= startDate;
      },
      {
        message: "La fecha fin debe ser posterior o igual a la fecha inicio.",
        path: ["end_date"],
      }
    ),
});

export function getDefaultValues({ name, shift, manager, temporalManager }) {
  return {
    name: name ?? "",
    shift_id: shift ? shift.id : "",
    manager_id: manager ? manager.id : "",
    temporal_manager: temporalManager
      ? {
          id: temporalManager.id,
          start_date: temporalManager.startDate.split("T")[0],
          end_date: temporalManager.endDate.split("T")[0],
        }
      : null,
  };
}
