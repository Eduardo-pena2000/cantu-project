import { Router } from "express";

import { AuthMiddleware, paramsIdValidator, routeAdapter, takeAssistanceValidator, upload } from "../../infraestructure";
import { makeDeleteAssistanceController, makeTakeAssistanceController, makeGetAssistanceHistoryController } from "../../application";

export class AssistanceRoutes {
  static get routes(): Router {
    const router = Router();

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteAssistanceController()));

    router.post(
      "/",
      upload.single("image"),
      takeAssistanceValidator.validate,
      routeAdapter(makeTakeAssistanceController())
    );

    router.get(
      "/history",
      AuthMiddleware.validateJWT,
      AuthMiddleware.verifyRoles(["admin", "general_manager"]),
      routeAdapter(makeGetAssistanceHistoryController())
    );

    return router;
  }
}
