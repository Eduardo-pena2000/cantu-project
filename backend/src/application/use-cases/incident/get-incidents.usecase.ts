import { Op } from "sequelize";
import { AppError } from "../../../shared";
import { Incident } from "../../../infraestructure/database/models/incident.model";
import User from "../../../infraestructure/database/models/user.model";
import Store from "../../../infraestructure/database/models/store.model";

export class GetIncidentsUseCase {
    async execute(params: {
        storeId?: number;
        status?: string;
        category?: string;
        priority?: string;
        page: number;
        limit: number;
    }) {
        try {
            const { storeId, status, category, priority, page = 1, limit = 10 } = params;
            const offset = (page - 1) * limit;

            const whereClause: any = {};

            if (storeId) whereClause.storeId = storeId;
            if (status) whereClause.status = status;
            if (category) whereClause.category = category;
            if (priority) whereClause.priority = priority;

            const { count, rows } = await Incident.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: "reportedBy",
                        attributes: ["id", "names", "last_names", "avatar_url"],
                    },
                    {
                        model: Store,
                        as: "store",
                        attributes: ["id", "name"],
                    },
                ],
                limit,
                offset,
                order: [["createdAt", "DESC"]],
            });

            return {
                data: rows,
                pagination: {
                    total: count,
                    page,
                    lastPage: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            console.log(error);
            throw AppError.internalServer("Error al obtener las incidencias");
        }
    }
}
