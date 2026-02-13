import { z } from "zod";

export const editAreaSchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
  manager_id: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number({ invalid_type_error: "Este campo es requerido." })
      .positive("Este campo es requerido.")
      .optional()
  ),
});

export function getDefaultValues({ name, manager }) {
  return {
    name: name ?? "",
    manager_id: manager ? manager.id : "",
  };
}
