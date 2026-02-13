import { Router } from "express";

import { paramsIdValidator, routeAdapter, takeAssistanceValidator, upload } from "../../infraestructure";
import { makeDeleteAssistanceController, makeTakeAssistanceController } from "../../application";

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

    return router;
  }
}
