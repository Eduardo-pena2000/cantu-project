import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const updateStore = [
  body("name").optional().isString().withMessage("El campo 'name' debe ser un texto."),
  body("address").optional().isString().withMessage("El campo 'address' debe ser un texto."),
  body("address_detail").optional().isString().withMessage("El campo 'address_detail' debe ser un texto."),
  body("suburb_name").optional().isString().withMessage("El campo 'suburb_name' debe ser un texto."),
  body("zip_code").optional().isString().withMessage("El campo 'zip_code' debe ser un texto."),
  body("municipality").optional().isString().withMessage("El campo 'municipality' debe ser un texto."),
];

export const updateStoreValidator = new ValidatorMiddleware(updateStore);
