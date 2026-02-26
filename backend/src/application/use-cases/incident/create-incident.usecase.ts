import { AppError } from "../../../shared";
import { CreateIncidentDto } from "../../../domain/dtos";
import { Incident } from "../../../infraestructure/database/models/incident.model";

export class CreateIncidentUseCase {
    async execute(dto: CreateIncidentDto) {
        try {
            const incident = await Incident.create({
                title: dto.title,
                description: dto.description,
                category: dto.category,
                priority: dto.priority,
                storeId: dto.storeId,
                reportedById: dto.reportedById,
                imageUrl: dto.imageUrl || null,
            });

            return incident;
        } catch (error) {
            throw AppError.internalServer("Error al crear la incidencia");
        }
    }
}
