import { z } from "zod";

export const createJobRoleSchema = z.object({
  name: z.string().trim().min(1, "Este campo es requerido."),
});

export const defaultValues = {
  name: "",
};
