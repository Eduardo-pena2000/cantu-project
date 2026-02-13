import { z } from "zod";

import { timeToMinutes } from "@/utils";

export const createShiftSchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
  schedules: z
    .record(
      z.string(),
      z
        .object({
          day: z.string(),
          week_day: z.number(),
          is_weekend: z.boolean(),
          start_time: z
            .string()
            .trim()
            .length(5, "Este campo es requerido.")
            .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ingresa una hora válida"),
          end_time: z
            .string()
            .trim()
            .length(5, "Este campo es requerido.")
            .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ingresa una hora válida"),
        })
        .optional()
        .refine(
          (val) => {
            if (val === undefined) return true;

            return timeToMinutes(val.end_time) > timeToMinutes(val.start_time);
          },
          {
            message: "La hora fin debe ser posterior a la hora inicio.",
            path: ["end_time"],
          }
        )
    )
    .refine((schedules) => Object.values(schedules).some((schedule) => schedule !== undefined), {
      message: "El turno debe tener como mínimo un día laboral establecido.",
      path: ["root"],
    }),
});

export const defaultValues = {
  name: "",
  schedules: {},
};
