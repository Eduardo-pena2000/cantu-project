import { AppError } from "../../../shared";
import { Incident } from "../../../infraestructure/database/models/incident.model";
import User from "../../../infraestructure/database/models/user.model";
import Store from "../../../infraestructure/database/models/store.model";

export class GetIncidentByIdUseCase {
    async execute(id: number) {
        try {
            const incident = await Incident.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: "reportedBy",
                        attributes: ["id", "names", "last_names", "avatar_url", "email", "phone"],
                    },
                    {
                        model: Store,
                        as: "store",
                        attributes: ["id", "name", "address"],
                    },
                ],
            });

            if (!incident) {
                throw AppError.notFound(`No se encontró ninguna incidencia con el id ${id}`);
            }

            return incident;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.log(error);
            throw AppError.internalServer("Error al obtener la incidencia");
        }
    }
}
