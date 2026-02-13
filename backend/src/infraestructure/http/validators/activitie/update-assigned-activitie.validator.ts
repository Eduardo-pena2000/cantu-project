import { body } from "express-validator";

import { ValidatorMiddleware } from "../../../../shared/interfaces/middlewares";

const updateActivitie = [
  body("deadline")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora límite debe tener el formato HH:mm."),
];

export const updateAssignedActivitieValidator = new ValidatorMiddleware(updateActivitie);
