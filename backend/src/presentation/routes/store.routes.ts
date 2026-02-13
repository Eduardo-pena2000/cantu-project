import { Router } from "express";

import {
  createStoreValidator,
  paginationValidator,
  paramsIdValidator,
  routeAdapter,
  updateStoreValidator,
  upload,
} from "../../infraestructure";
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

    router.post("/", upload.single("avatar"), createStoreValidator.validate, routeAdapter(makeCreateStoreController()));

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteStoreController()));

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetStoreController()));

    router.get("/", paginationValidator.validate, routeAdapter(makeGetStoresController()));

    router.patch(
      "/:id",
      upload.single("avatar"),
      paramsIdValidator.validate,
      updateStoreValidator.validate,
      routeAdapter(makeUpdateStoreController())
    );

    return router;
  }
}
