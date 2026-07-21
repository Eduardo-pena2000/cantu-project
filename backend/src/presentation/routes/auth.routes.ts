import { Router } from "express";

import { loginValidator, routeAdapter, authRateLimiter } from "../../infraestructure";
import { makeLoginController } from "../../application";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    router.post("/login", authRateLimiter, loginValidator.validate, routeAdapter(makeLoginController()));

    return router;
  }
}
