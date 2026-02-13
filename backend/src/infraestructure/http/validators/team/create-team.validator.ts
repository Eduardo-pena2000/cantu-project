import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const createTeam = [
  body("name")
    .notEmpty()
    .withMessage("El campo 'name' es obligatorio.")
    .isString()
    .withMessage("El campo 'name' debe ser un texto."),
  body("store_id")
    .isInt({ min: 1 })
    .withMessage("El store_id debe ser un número entero positivo.")
    .notEmpty()
    .withMessage("La tienda no puede estar vacío."),
  body("shift_id")
    .isInt({ min: 1 })
    .withMessage("El store_id debe ser un número entero positivo.")
    .notEmpty()
    .withMessage("La tienda no puede estar vacío."),
  body("manager_id")
    .notEmpty()
    .withMessage("El manager no puede estar vacío.")
    .isInt({ min: 1 })
    .withMessage("El manager_id debe ser un número entero positivo."),
  body("temporal_manager")
    .optional({ values: "null" })
    .isObject()
    .withMessage("El temporal_manager debe ser un objeto."),
  body("temporal_manager.id")
    .if(body("temporal_manager").exists({ values: "null" }))
    .isInt({ min: 1 })
    .withMessage("El id de temporal_manager debe ser un número entero positivo."),
  body("temporal_manager.start_date")
    .if(body("temporal_manager").exists({ values: "null" }))
    .isISO8601()
    .withMessage("El start_date de temporal_manager debe ser una fecha válida."),
  body("temporal_manager.end_date")
    .if(body("temporal_manager").exists({ values: "null" }))
    .isISO8601()
    .withMessage("El end_date de temporal_manager debe ser una fecha válida."),
];

export const createTeamValidator = new ValidatorMiddleware(createTeam);
