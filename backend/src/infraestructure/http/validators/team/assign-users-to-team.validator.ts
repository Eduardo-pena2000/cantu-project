import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const assignUsersToTeam = [
  body("team_id")
    .isInt({ min: 1 })
    .withMessage("El store_id debe ser un número entero positivo.")
    .notEmpty()
    .withMessage("La tienda no puede estar vacío."),
  body("user_id").isInt({ min: 1 }).withMessage("El user_id debe ser un número entero positivo."),
  body("working_days").isArray({ min: 1 }).withMessage("working_days debe ser un arreglo con al menos un día."),
  body("working_days").isInt({ min: 1 }).withMessage("working_days debe ser un arreglo con al menos un ID de día."),
];

export const assignUsersToTeamValidator = new ValidatorMiddleware(assignUsersToTeam);
