import { query } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared";

const getAllTeams = [
  query("store").optional().isInt({ min: 1 }).withMessage("El store_id debe ser un número entero positivo."),
  query("name").optional().isString().withMessage("El nombre debe ser una cadena de texto."),
  query("is_active").optional().isBoolean().withMessage("is_active debe ser un valor booleano."),
];

export const getAllTeamsValidator = new ValidatorMiddleware(getAllTeams);
