import { Router } from "express";

import { routeAdapter } from "../../infraestructure";
import { makeGetRolesController } from "../../application";

export class RoleRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", routeAdapter(makeGetRolesController()));

    return router;
  }
}
