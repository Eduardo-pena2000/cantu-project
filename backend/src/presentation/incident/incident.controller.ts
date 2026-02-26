import { Request, Response } from "express";
import { CreateIncidentDto, UpdateIncidentStatusDto } from "../../domain/dtos";
import {
    CreateIncidentUseCase,
    GetIncidentsUseCase,
    GetIncidentByIdUseCase,
    UpdateIncidentStatusUseCase,
} from "../../application/use-cases/incident/index";

export class IncidentController {
    constructor(
        private readonly createIncidentUseCase: CreateIncidentUseCase,
        private readonly getIncidentsUseCase: GetIncidentsUseCase,
        private readonly getIncidentByIdUseCase: GetIncidentByIdUseCase,
        private readonly updateIncidentStatusUseCase: UpdateIncidentStatusUseCase
    ) { }

    public getIncidents = async (req: Request, res: Response) => {
        const { store, status, category, priority, page, limit } = req.query;

        this.getIncidentsUseCase
            .execute({
                storeId: store ? Number(store) : undefined,
                status: status as string,
                category: category as string,
                priority: priority as string,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
            })
            .then((incidents: any) =>
                res.json({
                    status: "success",
                    message: "Todas las incidencias han sido obtenidas exitosamente.",
                    body: incidents,
                })
            )
            .catch((error: any) =>
                res.status(error.statusCode || 500).json({
                    status: "error",
                    error: error.message,
                })
            );
    };

    public getIncidentById = async (req: Request, res: Response) => {
        const { id } = req.params;

        this.getIncidentByIdUseCase
            .execute(Number(id))
            .then((incident: any) =>
                res.json({
                    status: "success",
                    message: `La incidencia con el id ${id} ha sido obtenida exitosamente.`,
                    body: incident,
                })
            )
            .catch((error: any) =>
                res.status(error.statusCode || 500).json({
                    status: "error",
                    error: error.message,
                })
            );
    };

    public createIncident = async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;

        const [error, createIncidentDto] = CreateIncidentDto.create({
            ...req.body,
            reportedById: userId,
        });

        if (error) {
            return res.status(error.statusCode).json({
                status: "error",
                error: error.message,
            });
        }

        this.createIncidentUseCase
            .execute(createIncidentDto!)
            .then((incident: any) =>
                res.status(201).json({
                    status: "success",
                    message: "La incidencia ha sido creada exitosamente.",
                    body: incident,
                })
            )
            .catch((error: any) =>
                res.status(error.statusCode || 500).json({
                    status: "error",
                    error: error.message,
                })
            );
    };

    public updateIncidentStatus = async (req: Request, res: Response) => {
        const { id } = req.params;

        const [error, updateIncidentStatusDto] = UpdateIncidentStatusDto.create(req.body);

        if (error) {
            return res.status(error.statusCode).json({
                status: "error",
                error: error.message,
            });
        }

        this.updateIncidentStatusUseCase
            .execute(Number(id), updateIncidentStatusDto!)
            .then((incident: any) =>
                res.json({
                    status: "success",
                    message: "El estado de la incidencia ha sido actualizado exitosamente.",
                    body: incident,
                })
            )
            .catch((error: any) =>
                res.status(error.statusCode || 500).json({
                    status: "error",
                    error: error.message,
                })
            );
    };
}
