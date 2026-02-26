import { Router } from "express";

import { IncidentController } from "./incident.controller";
import {
    CreateIncidentUseCase,
    GetIncidentsUseCase,
    GetIncidentByIdUseCase,
    UpdateIncidentStatusUseCase,
} from "../../application/use-cases/incident";

export class IncidentRoutes {
    static get routes(): Router {
        const router = Router();

        const createIncidentUseCase = new CreateIncidentUseCase();
        const getIncidentsUseCase = new GetIncidentsUseCase();
        const getIncidentByIdUseCase = new GetIncidentByIdUseCase();
        const updateIncidentStatusUseCase = new UpdateIncidentStatusUseCase();

        const controller = new IncidentController(
            createIncidentUseCase,
            getIncidentsUseCase,
            getIncidentByIdUseCase,
            updateIncidentStatusUseCase
        );


        router.get("/", controller.getIncidents as any);
        router.get("/:id", controller.getIncidentById as any);
        router.post("/", controller.createIncident as any);
        router.patch("/:id/status", controller.updateIncidentStatus as any);

        return router;
    }
}
