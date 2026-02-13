import { Router } from "express";

import {
  createShiftValidator,
  paginationValidator,
  paramsIdValidator,
  routeAdapter,
  updateShiftValidator,
} from "../../infraestructure";
import {
  makeDeleteShiftController,
  makeGetShiftController,
  makeGetShiftsController,
  makeCreateShiftController,
  makeUpdateShiftController,
  makeGetActiveScheduleController,
} from "../../application";

export class ShiftRoutes {
  static get routes(): Router {
    const router = Router();

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteShiftController()));

    router.get("/active", routeAdapter(makeGetActiveScheduleController()));

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetShiftController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetShiftsController()));

    router.post("/", createShiftValidator.validate, routeAdapter(makeCreateShiftController()));

    router.patch(
      "/:id",
      paramsIdValidator.validate,
      updateShiftValidator.validate,
      routeAdapter(makeUpdateShiftController())
    );

    return router;
  }
}
