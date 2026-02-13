import { z } from "zod";

export const editJobRoleSchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
});

export function getDefaultValues({ name }) {
  return {
    name: name ?? "",
  };
}
