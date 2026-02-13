import { body, ValidationChain } from "express-validator";
import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const assignAreaToUsers: ValidationChain[] = [
  body("area_id")
    .notEmpty()
    .withMessage("El campo 'area_id' es requerido.")
    .isNumeric()
    .withMessage("El campo 'area_id' debe ser un número."),
  body("added_users")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          throw new Error("El campo 'added_users' debe ser un arreglo válido.");
        }
      }

      return value;
    })
    .isArray()
    .withMessage("El campo 'added_users' debe ser un arreglo."),
  body("deleted_users")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          throw new Error("El campo 'deleted_users' debe ser un arreglo válido.");
        }
      }

      return value;
    })
    .isArray()
    .withMessage("El campo 'deleted_users' debe ser un arreglo."),
];

export const assignAreaToUsersValidator = new ValidatorMiddleware(assignAreaToUsers);
