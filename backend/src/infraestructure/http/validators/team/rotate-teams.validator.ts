import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const rotateTeams = [
  body("store_id")
    .isInt({ min: 1 })
    .withMessage("El store_id debe ser un número entero positivo.")
    .notEmpty()
    .withMessage("La tienda no puede estar vacío."),
];

export const rotateTeamsValidator = new ValidatorMiddleware(rotateTeams);
