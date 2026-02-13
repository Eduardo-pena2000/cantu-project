import { Router } from "express";

import {
  createJobRoleValidator,
  paginationValidator,
  paramsIdValidator,
  routeAdapter,
  updateJobRoleValidator,
} from "../../infraestructure";
import {
  makeCreateJobRoleController,
  makeDeleteJobRoleController,
  makeGetJobRolesByAreaController,
  makeGetJobRoleController,
  makeGetJobRolesController,
  makeUpdateJobRoleController,
} from "../../application";

export class JobRoleRoutes {
  static get routes(): Router {
    const router = Router();

    router.post("/", createJobRoleValidator.validate, routeAdapter(makeCreateJobRoleController()));

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteJobRoleController()));

    router.get("/area/:id", routeAdapter(makeGetJobRolesByAreaController()));

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetJobRoleController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetJobRolesController()));

    router.patch(
      "/:id",
      paramsIdValidator.validate,
      updateJobRoleValidator.validate,
      routeAdapter(makeUpdateJobRoleController())
    );

    return router;
  }
}
