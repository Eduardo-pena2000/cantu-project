import { Router } from "express";

import {
  createAreaValidator,
  paginationValidator,
  paramsIdValidator,
  routeAdapter,
  updateAreaValidator,
} from "../../infraestructure";
import {
  makeCreateAreaController,
  makeDeleteAreaController,
  makeGetAreaController,
  makeGetAreasController,
  makeUpdateAreaController,
} from "../../application";

export class AreaRoutes {
  static get routes(): Router {
    const router = Router();

    router.post("/", createAreaValidator.validate, routeAdapter(makeCreateAreaController()));

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteAreaController()));

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetAreaController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetAreasController()));

    router.patch(
      "/:id",
      paramsIdValidator.validate,
      updateAreaValidator.validate,
      routeAdapter(makeUpdateAreaController())
    );

    return router;
  }
}
