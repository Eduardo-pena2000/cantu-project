import { type Response, type NextFunction, type Request } from "express";
import { Result, ValidationError } from "express-validator";

import { HttpCode } from "../../constans";
import { AppError } from "../../errors/app.error";

export interface ErrorResponse {
  name: string;
  message: string;
  validationErrors?: Result<ValidationError>;
  stack?: string;
}

export class ErrorMiddleware {
  public static handleError = (
    error: any,
    _: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
  ): void => {
    if (error instanceof AppError) {
      const { message, name, stack, validationErrors } = error;
      const statusCode = error.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ name, message, validationErrors, stack });
    } else {
      const name = "InternalServerError";
      const message = "An internal server error occurred";
      const statusCode = HttpCode.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ name, message, stack: error?.stack || String(error) });
    }

    next();
  };
}
