import { Router } from "express";

import {
  createStoreValidator,
  paginationValidator,
  paramsIdValidator,
  routeAdapter,
  updateStoreValidator,
  upload,
  RoleHandler,
} from "../../infraestructure";
import { Roles } from "../../shared";
import {
  makeCreateStoreController,
  makeDeleteStoreController,
  makeGetStoreController,
  makeGetStoresController,
  makeUpdateStoreController,
} from "../../application";

export class StoreRoutes {
  static get routes(): Router {
    const router = Router();

    router.post(
      "/",
      upload.single("avatar"),
      RoleHandler.hasRole([Roles.admin, Roles.general_manager]),
      createStoreValidator.validate,
      routeAdapter(makeCreateStoreController())
    );

    router.delete(
      "/:id",
      RoleHandler.hasRole([Roles.admin, Roles.general_manager]),
      paramsIdValidator.validate,
      routeAdapter(makeDeleteStoreController())
    );

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetStoreController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetStoresController()));

    router.patch(
      "/:id",
      upload.single("avatar"),
      RoleHandler.hasRole([Roles.admin, Roles.general_manager]),
      paramsIdValidator.validate,
      updateStoreValidator.validate,
      routeAdapter(makeUpdateStoreController())
    );

    return router;
  }
}
