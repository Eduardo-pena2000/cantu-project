import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

export const createShift = [
  body("name")
    .isString()
    .withMessage("El nombre es requerido y debe ser un string.")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío."),
  body("store_id")
    .isInt({ min: 1 })
    .withMessage("El store_id debe ser un número entero positivo.")
    .notEmpty()
    .withMessage("La tienda no puede estar vacío."),
  body("schedules")
    .notEmpty()
    .withMessage("Los rangos de tiempo es requerido.")
    .isArray()
    .withMessage("Los rangos de tiempo debe ser un arreglo."),
  body("schedules.*.start_time")
    .if(body("schedules").exists())
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("El start_time debe tener formato HH:mm."),
  body("schedules.*.end_time")
    .if(body("schedules").exists())
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("El end_time debe tener formato HH:mm."),
  body("schedules.*.week_day")
    .if(body("schedules").exists())
    .isInt({ min: 0, max: 6 })
    .withMessage("El week_day debe ser un número entre 0 (domingo) y 6 (sábado)."),
];

export const createShiftValidator = new ValidatorMiddleware(createShift);
