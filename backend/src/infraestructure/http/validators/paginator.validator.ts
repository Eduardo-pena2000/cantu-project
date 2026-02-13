import { query } from "express-validator";

import { ValidatorMiddleware } from "../../../shared/interfaces/middlewares";

export const pagitatorQuery = [
  query("page").optional().isInt({ gt: 0 }).withMessage("El parámetro 'page' debe ser un número entero positivo."),
  query("limit")
    .optional()
    .isInt({ gt: 0, lt: 101 })
    .withMessage("El parámetro 'limit' debe ser un número entero positivo y no mayor a 100."),
];

export const paginationValidator = new ValidatorMiddleware(pagitatorQuery);
