import { NextFunction, Response } from "express";

import { AppError, CustomRequest } from "../../../shared";
import { UserRepository } from "../../../domain";

import { TokenService } from "../..";

export class AuthHandler {
  constructor(private readonly userRepository: UserRepository) {}

  // static checkApiKey(req: Request, _res: Response, next: NextFunction) {
  //   const apiKey = req.headers["api-key"];

  //   if (apiKey === envs.APP_API_KEY) {
  //     next();
  //   } else {
  //     next(AppError.unauthorized("El Api Key es requerido."));
  //   }
  // }

  public verifyToken = async (req: CustomRequest, _res: Response, next: NextFunction) => {
    let token: string | null = "";

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    try {
      if (!token) return next(AppError.unauthorized("El token es requerido."));

      const decodedToken = TokenService.verifyToken(token);

      const user = await this.userRepository.findById(decodedToken.id);

      if (!user) {
        return next(AppError.unauthorized("El usuario no existe."));
      }

      req.user = user;

      next();
    } catch (error) {
      next(AppError.unauthorized(error as string));
    }
  };
}
