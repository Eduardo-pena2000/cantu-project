import { z } from "zod";
import { AppError } from "../../../shared";

const CATEGORIES = ["maintenance", "inventory", "hr", "operations", "suggestion"] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

const createIncidentSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(150, "El título no puede exceder los 150 caracteres"),
    description: z.string().min(10, "Por favor proporciona más detalles sobre la incidencia"),
    category: z.enum(CATEGORIES),
    priority: z.enum(PRIORITIES),
    storeId: z.number().int("El ID de la tienda debe ser un número entero"),
    imageUrl: z.string().url().optional().nullable(),
});

export class CreateIncidentDto {
    private constructor(
        public readonly title: string,
        public readonly description: string,
        public readonly category: string,
        public readonly priority: string,
        public readonly storeId: number,
        public readonly reportedById: number,
        public readonly imageUrl?: string | null
    ) { }

    static create(props: {
        [key: string]: any;
    }): [AppError?, CreateIncidentDto?] {
        const { success, data, error } = createIncidentSchema.safeParse(props);

        if (!success) {
            const fieldErrors = error.flatten().fieldErrors;
            const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
            const firstErrorMessage = fieldErrors[firstErrorKey]?.[0];
            return [AppError.badRequest(firstErrorMessage || "Datos inválidos")];
        }

        return [
            undefined,
            new CreateIncidentDto(
                data.title,
                data.description,
                data.category,
                data.priority,
                data.storeId,
                props.reportedById,
                data.imageUrl || null
            ),
        ];
    }
}
