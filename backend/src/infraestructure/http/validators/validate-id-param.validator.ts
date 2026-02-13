import { param } from "express-validator";

import { ValidatorMiddleware } from "../../../shared/interfaces/middlewares";

export const validateIdParam = [
  param("id")
    .notEmpty()
    .withMessage("El parámetro 'id' es obligatorio.")
    .isInt({ gt: 0 })
    .withMessage("El parámetro 'id' debe ser un número entero positivo."),
];

export const paramsIdValidator = new ValidatorMiddleware(validateIdParam);
