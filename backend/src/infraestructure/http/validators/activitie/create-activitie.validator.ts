import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const createActivitie = [
  body("name")
    .notEmpty()
    .withMessage("El campo 'name' es obligatorio.")
    .isString()
    .withMessage("El campo 'name' debe ser un texto."),
  body("description")
    .notEmpty()
    .withMessage("El campo 'description' es obligatorio.")
    .isString()
    .withMessage("El campo 'description' debe ser un texto."),
  body("area_id")
    .notEmpty()
    .withMessage("El campo 'area_id' es obligatorio.")
    .isNumeric()
    .withMessage("El campo 'area_id' debe ser un número."),
  body("job_role_id")
    .notEmpty()
    .withMessage("El campo 'job_role_id' es obligatorio.")
    .isNumeric()
    .withMessage("El campo 'job_role_id' debe ser un número."),
];

export const createActivitieValidator = new ValidatorMiddleware(createActivitie);
