import { z } from "zod";
import { AppError } from "../../../shared";

const STATUSES = ["pending", "in_progress", "resolved", "rejected"] as const;

const updateIncidentStatusSchema = z.object({
    status: z.enum(STATUSES),
    resolutionNotes: z.string().optional(),
});

export class UpdateIncidentStatusDto {
    private constructor(
        public readonly status: string,
        public readonly resolutionNotes?: string
    ) { }

    static create(props: {
        [key: string]: any;
    }): [AppError?, UpdateIncidentStatusDto?] {
        const { success, data, error } = updateIncidentStatusSchema.safeParse(props);

        if (!success) {
            const fieldErrors = error.flatten().fieldErrors;
            const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
            const firstErrorMessage = fieldErrors[firstErrorKey]?.[0];
            return [AppError.badRequest(firstErrorMessage || "Datos de actualización inválidos")];
        }

        return [
            undefined,
            new UpdateIncidentStatusDto(data.status, data.resolutionNotes),
        ];
    }
}
