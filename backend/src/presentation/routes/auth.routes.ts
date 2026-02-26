import { Router } from "express";

import { loginValidator, routeAdapter } from "../../infraestructure";
import { makeLoginController } from "../../application";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    router.post("/login", loginValidator.validate, routeAdapter(makeLoginController()));

    return router;

  }
}
