import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const bulkAssignmentActivitie = [
  body("assistance_id")
    .notEmpty()
    .withMessage("El ID de asistencia es obligatorio.")
    .isNumeric()
    .withMessage("El ID de asistencia debe ser un número."),
  body("assignments")
    .notEmpty()
    .withMessage("La lista de actividades es obligatoria.")
    .isArray({ min: 1 })
    .withMessage("Debe enviar al menos una actividad."),
  body("assignments.*.activitie_id")
    .notEmpty()
    .withMessage("El ID de la actividad es obligatorio.")
    .isNumeric()
    .withMessage("El ID de la actividad debe ser un número."),
  body("assignments.*.deadline")
    .notEmpty()
    .withMessage("La hora límite de cada actividad es obligatoria.")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora límite debe tener el formato HH:mm."),
];

export const bulkAssignmentActivitieValidator = new ValidatorMiddleware(bulkAssignmentActivitie);
