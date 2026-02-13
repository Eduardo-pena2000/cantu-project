import { z } from "zod";

export const createActivitySchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
  description: z.string().trim().min(1, { message: "Este campo es requerido." }),
  area_id: z.preprocess(
    (val) => {
      if (val === "") return undefined;
      if (typeof val === "string") return Number(val);
      return val;
    },
    z
      .number({
        required_error: "Este campo es requerido.",
        invalid_type_error: "Selecciona una área válida.",
      })
      .positive("Este campo es requerido.")
  ),
});

export const defaultValues = {
  name: "",
  description: "",
  area_id: "",
};
