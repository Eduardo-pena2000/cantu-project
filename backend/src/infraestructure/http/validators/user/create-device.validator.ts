import { body, ValidationChain } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const createDevice: ValidationChain[] = [body("token").isString().withMessage("El campo 'token' debe ser un texto.")];

export const createDeviceValidator = new ValidatorMiddleware(createDevice);
