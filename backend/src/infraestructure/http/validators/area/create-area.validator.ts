import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const createArea = [
  body("name")
    .notEmpty()
    .withMessage("El campo 'name' es obligatorio.")
    .isString()
    .withMessage("El campo 'name' debe ser un texto."),
  body("store_id").optional().isNumeric().withMessage("El campo 'store_id' debe ser un número."),
  body("manager_id").optional().isNumeric().withMessage("El campo 'manager_id' debe ser un número."),
];

export const createAreaValidator = new ValidatorMiddleware(createArea);
