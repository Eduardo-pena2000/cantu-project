import { Router } from "express";

import { AuthRoutes } from "./routes/auth.routes";
import { UserRoutes } from "./routes/user.routes";
import { StoreRoutes } from "./routes/store.routes";
import { RoleRoutes } from "./routes/role.routes";
import { AreaRoutes } from "./routes/area.routes";
import { ShiftRoutes } from "./routes/shift.routes";
import { TeamRoutes } from "./routes/team.routes";
import { ActivitieRoutes } from "./routes/activitie.routes";
import { JobRoleRoutes } from "./routes/job-role.routes";
import { AssistanceRoutes } from "./routes/assistance.routes";
import { ReportRoutes } from "./routes/report.routes";

import { AuthAdapter } from "../infraestructure";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/auth", AuthRoutes.routes);

    const authAdapterInstance = new AuthAdapter();

    const authAdapter = authAdapterInstance.getHandler();

    router.use(authAdapter.verifyToken);

    router.use("/user", UserRoutes.routes);
    router.use("/role", RoleRoutes.routes);
    router.use("/store", StoreRoutes.routes);
    router.use("/area", AreaRoutes.routes);
    router.use("/shift", ShiftRoutes.routes);
    router.use("/team", TeamRoutes.routes);
    router.use("/activitie", ActivitieRoutes.routes);
    router.use("/job-role", JobRoleRoutes.routes);
    router.use("/assistance", AssistanceRoutes.routes);
    router.use("/reports", ReportRoutes.routes);

    return router;
  }
}
