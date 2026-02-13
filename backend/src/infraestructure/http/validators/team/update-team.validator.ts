import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const updateTeam = [body("name").optional().isString().withMessage("El campo 'name' debe ser un texto.")];

export const updateTeamValidator = new ValidatorMiddleware(updateTeam);
