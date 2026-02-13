import { Router } from "express";

import { routeAdapter } from "../../infraestructure";
import {
  makeGetActivitiesByUserReportController,
  makeGetUserssByTeamReportController,
  makeGetTeamsReportController,
} from "../../application";

export class ReportRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/users/:id/activities", routeAdapter(makeGetActivitiesByUserReportController()));

    router.get("/teams/:id/users", routeAdapter(makeGetUserssByTeamReportController()));

    router.get("/teams", routeAdapter(makeGetTeamsReportController()));

    return router;
  }
}
