import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const createStore = [
  body("name")
    .notEmpty()
    .withMessage("El campo 'name' es obligatorio.")
    .isString()
    .withMessage("El campo 'name' debe ser un texto."),
  body("address")
    .notEmpty()
    .withMessage("El campo 'address' es obligatorio.")
    .isString()
    .withMessage("El campo 'address' debe ser un texto."),
  body("address_detail").optional().isString().withMessage("El campo 'address_detail' debe ser un texto."),
  body("suburb_name")
    .notEmpty()
    .withMessage("El campo 'suburb_name' es obligatorio.")
    .isString()
    .withMessage("El campo 'suburb_name' debe ser un texto."),
  body("zip_code")
    .notEmpty()
    .withMessage("El campo 'zip_code' es obligatorio.")
    .isString()
    .withMessage("El campo 'zip_code' debe ser un texto."),
  body("municipality")
    .notEmpty()
    .withMessage("El campo 'municipality' es obligatorio.")
    .isString()
    .withMessage("El campo 'municipality' debe ser un texto."),
];

export const createStoreValidator = new ValidatorMiddleware(createStore);
