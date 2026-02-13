import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const login = [
  body("email")
    .notEmpty()
    .withMessage("El campo 'email' es obligatorio.")
    .isEmail()
    .withMessage("El campo 'email' debe ser un correo electrónico válido."),
  body("password")
    .notEmpty()
    .withMessage("El campo 'password' es obligatorio.")
    .isString()
    .withMessage("El campo 'password' debe ser un texto.")
    .isLength({ min: 6 })
    .withMessage("El campo 'password' debe tener al menos 6 caracteres."),
];

export const loginValidator = new ValidatorMiddleware(login);
