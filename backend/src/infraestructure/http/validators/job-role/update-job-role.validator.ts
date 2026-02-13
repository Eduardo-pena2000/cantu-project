import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const updateJobRole = [body("name").optional().isString().withMessage("El campo 'name' debe ser un texto.")];

export const updateJobRoleValidator = new ValidatorMiddleware(updateJobRole);
