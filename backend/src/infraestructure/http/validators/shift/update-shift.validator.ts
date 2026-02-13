import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

export const updateShift = [
  body("name").optional().isString().withMessage("El nombre es requerido y debe ser un string."),
  body("manager_id").optional().isInt({ min: 1 }).withMessage("El manager_id debe ser un número entero positivo."),
  body("temporal_manager").optional().isObject().withMessage("El temporal_manager debe ser un objeto."),
  body("temporal_manager.id")
    .if(body("temporal_manager").exists())
    .isInt({ min: 1 })
    .withMessage("El id de temporal_manager debe ser un número entero positivo."),
  body("temporal_manager.start_date")
    .if(body("temporal_manager").exists())
    .isISO8601()
    .withMessage("El start_date de temporal_manager debe ser una fecha válida."),
  body("temporal_manager.end_date")
    .if(body("temporal_manager").exists())
    .isISO8601()
    .withMessage("El end_date de temporal_manager debe ser una fecha válida."),
  body("schedules").optional().isArray().withMessage("Los rangos de tiempo debe ser un arreglo."),
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

export const updateShiftValidator = new ValidatorMiddleware(updateShift);
