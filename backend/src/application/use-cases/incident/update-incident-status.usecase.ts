import { AppError } from "../../../shared";
import { UpdateIncidentStatusDto } from "../../../domain/dtos";
import { Incident } from "../../../infraestructure/database/models/incident.model";

export class UpdateIncidentStatusUseCase {
    async execute(id: number, dto: UpdateIncidentStatusDto) {
        try {
            const incident = await Incident.findByPk(id);

            if (!incident) {
                throw AppError.notFound(`No se encontró la incidencia con el id ${id} para actualizar.`);
            }

            await incident.update({
                status: dto.status,
                resolutionNotes: dto.resolutionNotes !== undefined ? dto.resolutionNotes : incident.resolutionNotes,
            });

            return incident;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.log(error);
            throw AppError.internalServer("Error al actualizar la incidencia");
        }
    }
}
