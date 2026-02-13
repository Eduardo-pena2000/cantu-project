import { body } from "express-validator";
import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const qualifyActivitie = [
  body("assignment_activitie_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de la asignación debe ser un número entero positivo."),
  body("manager_note").optional().isNumeric().withMessage("La nota del manager debe ser un número."),
  body("shift_manager_note").optional().isNumeric().withMessage("La nota del jefe de turno debe ser un número."),
  body("shift_manager_comments")
    .optional()
    .isString()
    .withMessage("Los comentarios del jefe de turno deben ser texto."),
  body("manager_comments").optional().isString().withMessage("Los comentarios del manager deben ser texto."),
];

export const qualifyActivitieValidator = new ValidatorMiddleware(qualifyActivitie);
