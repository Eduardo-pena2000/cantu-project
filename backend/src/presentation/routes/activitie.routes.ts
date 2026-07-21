import { Router } from "express";

import {
  assigmentActivitieValidator,
  bulkAssignmentActivitieValidator,
  createActivitieValidator,
  paginationValidator,
  paramsIdValidator,
  qualifyActivitieValidator,
  routeAdapter,
  updateActivitieValidator,
  updateAssignedActivitieValidator,
  upload,
} from "../../infraestructure";
import {
  makeCreateActivitieController,
  makeAssigmentActivitieController,
  makeBulkAssignmentActivitieController,
  makeQualifyActivitieController,
  makeDeleteAssignedActivitieController,
  makeDeleteActivitieController,
  makeGetActivitieController,
  makeGetActivitiesByAreaController,
  makeGetAssignedActivitieController,
  makeGetActivitiesController,
  makeUpdateAssignedActivitieController,
  makeUpdateActivitieNoteController,
  makeUpdateActivitieController,
} from "../../application";

export class ActivitieRoutes {
  static get routes(): Router {
    const router = Router();

    router.post("/", createActivitieValidator.validate, routeAdapter(makeCreateActivitieController()));

    router.post("/assignment", assigmentActivitieValidator.validate, routeAdapter(makeAssigmentActivitieController()));

    router.post("/assignment/bulk", bulkAssignmentActivitieValidator.validate, routeAdapter(makeBulkAssignmentActivitieController()));

    router.post(
      "/qualify",
      upload.single("image"),
      qualifyActivitieValidator.validate,
      routeAdapter(makeQualifyActivitieController())
    );

    router.delete("/assigned/:id", paramsIdValidator.validate, routeAdapter(makeDeleteAssignedActivitieController()));

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteActivitieController()));

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetActivitieController()));

    router.get("/area/:id", paramsIdValidator.validate, routeAdapter(makeGetActivitiesByAreaController()));

    router.get("/assigned/:id", paramsIdValidator.validate, routeAdapter(makeGetAssignedActivitieController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetActivitiesController()));

    router.patch(
      "/assigned/:id",
      paramsIdValidator.validate,
      updateAssignedActivitieValidator.validate,
      routeAdapter(makeUpdateAssignedActivitieController())
    );

    router.patch(
      "/:id/qualify",
      paramsIdValidator.validate,
      qualifyActivitieValidator.validate,
      routeAdapter(makeUpdateActivitieNoteController())
    );

    router.patch(
      "/:id",
      paramsIdValidator.validate,
      updateActivitieValidator.validate,
      routeAdapter(makeUpdateActivitieController())
    );

    return router;
  }
}
