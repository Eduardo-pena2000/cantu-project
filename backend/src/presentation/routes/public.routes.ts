import { Router } from "express";

import { routeAdapter } from "../../infraestructure";
import { makeGetStoresController } from "../../application";
import { TvDashboardController } from "../controllers/public/tv-dashboard.controller";
import { paramsIdValidator } from "../../infraestructure";

export class PublicRoutes {
  static get routes(): Router {
    const router = Router();

    // Reutilizamos el controlador de tiendas que no retorna data sensible (solo id, nombre, etc.)
    router.get("/stores", routeAdapter(makeGetStoresController()));

    // Nueva ruta para el dashboard de TV
    router.get(
      "/tv-dashboard/:id", 
      paramsIdValidator.validate, // Usamos el id validator (aunque asume param 'id' no 'storeId')
      routeAdapter(new TvDashboardController())
    );

    return router;
  }
}
