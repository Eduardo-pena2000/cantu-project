import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const takeAssistance = [
  body("employee_id")
    .notEmpty()
    .withMessage("El ID del empleado es obligatorio")
    .isNumeric()
    .withMessage("El ID del empleado debe ser un número"),
  body("schedule_id")
    .notEmpty()
    .withMessage("El ID del horario es obligatorio")
    .isNumeric()
    .withMessage("El ID del horario debe ser un número"),
  body("status")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["PRESENTE", "EXCUSADO", "AUSENTE"])
    .withMessage("El estado debe ser 'PRESENTE', 'EXCUSADO' o 'AUSENTE'"),
];

export const takeAssistanceValidator = new ValidatorMiddleware(takeAssistance);
