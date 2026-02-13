import { Router } from "express";

import {
  assignUsersToTeamValidator,
  createTeamValidator,
  paginationValidator,
  paramsIdValidator,
  rotateTeamsValidator,
  routeAdapter,
  updateTeamValidator,
} from "../../infraestructure";
import {
  makeAssignUsersToTeamController,
  makeRotateTeamsController,
  makeCreateTeamController,
  makeDeleteTeamController,
  makeDeleteUserOfTeamController,
  makeGetTeamController,
  makeGetTeamsController,
  makeUpdateTeamController,
} from "../../application";
import { getAllTeamsValidator } from "../../infraestructure/http/validators/team/get-all-teams.validaator";

export class TeamRoutes {
  static get routes(): Router {
    const router = Router();

    router.post("/member", assignUsersToTeamValidator.validate, routeAdapter(makeAssignUsersToTeamController()));

    router.post("/rotate", rotateTeamsValidator.validate, routeAdapter(makeRotateTeamsController()));

    router.post("/", createTeamValidator.validate, routeAdapter(makeCreateTeamController()));

    router.delete("/:id", paramsIdValidator.validate, routeAdapter(makeDeleteTeamController()));

    router.delete("/:teamId/user/:userId", routeAdapter(makeDeleteUserOfTeamController()));

    router.get("/:id", paramsIdValidator.validate, routeAdapter(makeGetTeamController()));

    router.get(
      "/",
      paginationValidator.validate,
      getAllTeamsValidator.validate,
      routeAdapter(makeGetTeamsController())
    );

    router.patch(
      "/:id",
      paramsIdValidator.validate,
      updateTeamValidator.validate,
      routeAdapter(makeUpdateTeamController())
    );

    return router;
  }
}
