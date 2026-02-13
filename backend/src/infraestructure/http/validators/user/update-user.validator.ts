import { body, ValidationChain } from "express-validator";
import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const updateUser: ValidationChain[] = [
  body("names").optional().isString().withMessage("El campo 'names' debe ser un texto."),
  body("last_names").optional().isString().withMessage("El campo 'last_names' debe ser un texto."),
  body("phone")
    .optional()
    .isString()
    .withMessage("El campo 'phone' debe ser un texto.")
    .isLength({ min: 10, max: 15 })
    .withMessage("El campo 'phone' debe tener entre 10 y 15 caracteres."),
  body("email").optional().isEmail().withMessage("El campo 'email' debe ser un correo electrónico válido."),
  body("username")
    .optional()
    .isString()
    .withMessage("El campo 'username' debe ser un texto.")
    .isLength({ min: 4, max: 20 })
    .withMessage("El campo 'username' debe tener entre 4 y 20 caracteres."),
  body("store_id").optional().isNumeric().withMessage("El campo 'store_id' debe ser un número."),
  body("area_id").optional().isNumeric().withMessage("El campo 'area_id' debe ser un número."),
  body("roles")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          throw new Error("El campo 'roles' debe ser un arreglo válido.");
        }
      }

      return value;
    })
    .isArray()
    .withMessage("El campo 'roles' debe ser un arreglo."),
];

export const updateUserValidator = new ValidatorMiddleware(updateUser);
