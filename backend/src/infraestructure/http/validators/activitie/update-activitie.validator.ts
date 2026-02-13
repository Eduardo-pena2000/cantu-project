import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const updateActivitie = [
  body("name").optional().isString().withMessage("El campo 'name' debe ser un texto."),
  body("description").optional().isString().withMessage("El campo 'description' debe ser un texto."),
  body("job_role_id").optional().isNumeric().withMessage("El campo 'job_role_id' debe ser un número."),
];

export const updateActivitieValidator = new ValidatorMiddleware(updateActivitie);
