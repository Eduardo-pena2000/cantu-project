import { Router } from "express";

import {
  assignAreaToUsersValidator,
  createDeviceValidator,
  createUserValidator,
  paginationValidator,
  paramsIdValidator,
  routeAdapter,
  updateUserValidator,
  upload,
  RoleHandler,
} from "../../infraestructure";
import { Roles } from "../../shared";
import {
  makeCreateUserController,
  makeAssignAreaToUsersController,
  makeDeleteUserController,
  makeGetUserController,
  makeGetUsersByAssistanceCurrentDayController,
  makeGetAssignedActivitiesFromUsersController,
  makeGetUsersWithoutTeamController,
  makeGetUsersByScheduleController,
  makeGetUsersController,
  makeUpdateUserController,
  makeCreateDeviceController,
} from "../../application";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    router.post(
      "/create",
      upload.single("avatar"),
      RoleHandler.hasRole([Roles.admin, Roles.general_manager, Roles.store_manager]),
      createUserValidator.validate,
      routeAdapter(makeCreateUserController())
    );

    router.post("/device", createDeviceValidator.validate, routeAdapter(makeCreateDeviceController()));

    router.post("/assign-area", assignAreaToUsersValidator.validate, routeAdapter(makeAssignAreaToUsersController()));

    router.delete(
      "/:id",
      RoleHandler.hasRole([Roles.admin, Roles.general_manager]),
      paramsIdValidator.validate,
      routeAdapter(makeDeleteUserController())
    );

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetUserController()));

    router.get(
      "/assistance/schedule/:id",
      paramsIdValidator.validate,
      routeAdapter(makeGetUsersByAssistanceCurrentDayController())
    );

    router.get(
      "/activities/schedule/:scheduleId/store/:storeId",
      routeAdapter(makeGetAssignedActivitiesFromUsersController())
    );

    router.get(
      "/without-team/store/:id",
      paramsIdValidator.validate,
      routeAdapter(makeGetUsersWithoutTeamController())
    );

    router.get("/schedule/:id", paginationValidator.validate, routeAdapter(makeGetUsersByScheduleController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetUsersController()));

    router.patch(
      "/:id",
      upload.single("avatar"),
      RoleHandler.hasRole([Roles.admin, Roles.general_manager, Roles.store_manager]),
      paramsIdValidator.validate,
      updateUserValidator.validate,
      routeAdapter(makeUpdateUserController())
    );

    return router;
  }
}
