import { z } from "zod";

import { timeToMinutes } from "@/utils";

export const editShiftSchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
  schedules: z
    .record(
      z.string(),
      z
        .object({
          id: z.number().positive("Este campo es requerido.").optional(),
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

function getDefaultSchedules(schedules) {
  const obj = {};

  for (let i = 0; i < schedules.length; i++) {
    const { id, day, weekDay, isWeekend, startTime, endTime } = schedules[i];

    obj[weekDay] = {
      id,
      day,
      week_day: weekDay,
      is_weekend: isWeekend,
      start_time: startTime,
      end_time: endTime,
    };
  }

  return obj;
}

export function getDefaultValues({ name, schedules }) {
  const shift = {
    name: name ?? "",
    schedules: getDefaultSchedules(schedules),
  };

  return shift;
}
