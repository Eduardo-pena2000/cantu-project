import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const assigmentActivitie = [
  body("activitie_id")
    .notEmpty()
    .withMessage("El ID de la actividad es obligatorio.")
    .isNumeric()
    .withMessage("El ID de la actividad debe ser un número."),
  body("assistance_id")
    .notEmpty()
    .withMessage("El ID de la asistencia es obligatorio.")
    .isNumeric()
    .withMessage("El ID de la asistencia debe ser un número."),
  body("deadline")
    .notEmpty()
    .withMessage("La hora límite es obligatoria.")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora límite debe tener el formato HH:mm."),
];

export const assigmentActivitieValidator = new ValidatorMiddleware(assigmentActivitie);
