import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const createJobRole = [
  body("name")
    .notEmpty()
    .withMessage("El campo 'name' es obligatorio.")
    .isString()
    .withMessage("El campo 'name' debe ser un texto."),
  body("store_id")
    .notEmpty()
    .withMessage("El campo 'store_id' es obligatorio.")
    .isNumeric()
    .withMessage("El campo 'store_id' debe ser un número."),
];

export const createJobRoleValidator = new ValidatorMiddleware(createJobRole);
