import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

import { ExpirationTokenOutput, SignTokenDto } from "../../domain/dtos";

import { AppError } from "../../shared";

import { envs } from "../config";

export class TokenService {
  static generateAccessToken(data: SignTokenDto): string {
    return jwt.sign(data, envs.JWT_SECRET, { expiresIn: envs.JWT_ACCESS_EXPIRES });
  }

  static generateRefreshToken(): string {
    return jwt.sign({}, envs.JWT_SECRET, { expiresIn: envs.JWT_REFRESH_EXPIRES });
  }

  static isTokenWithinExpirationThreshold(expirationTime: number): ExpirationTokenOutput {
    const TOKEN_EXPIRATION = 5 * 60;
    const TOKEN_TOLERANCE = 15 * 60;

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const timeRemaining = expirationTime - currentTimeInSeconds;

    if (timeRemaining > TOKEN_EXPIRATION) {
      return { renew: false, timeRemaining };
    }

    if (timeRemaining <= 0 && Math.abs(timeRemaining) <= TOKEN_TOLERANCE) {
      return { renew: true, timeRemaining };
    }

    return { renew: false, timeRemaining };
  }

  static refreshToken(tokenRefresh: string): string {
    const decoded = jwt.decode(tokenRefresh, { complete: true });

    if (!decoded) throw AppError.unauthorized("Token invalido");

    const { exp } = decoded.payload as JwtPayload & SignTokenDto;

    const { renew, timeRemaining } = this.isTokenWithinExpirationThreshold(exp!);

    if (renew) {
      const payload = jwt.verify(tokenRefresh, envs.JWT_SECRET, {
        ignoreExpiration: true,
      }) as SignTokenDto;

      return this.generateAccessToken({
        id: payload.id,
      });
    }

    if (timeRemaining > 0) {
      return tokenRefresh;
    }

    throw AppError.unauthorized("Token expirado, redirigir al login");
  }

  static verifyToken(token: string): SignTokenDto {
    let decodedToken: SignTokenDto | null = null;

    try {
      decodedToken = jwt.decode(token) as SignTokenDto | null;

      if (!decodedToken) {
        throw AppError.unauthorized("Token invalido.");
      }

      jwt.verify(token, envs.JWT_SECRET);

      return decodedToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw AppError.unauthorized("El token ha expirado");
      }

      if (error instanceof JsonWebTokenError) {
        throw AppError.unauthorized("Token inválido");
      }

      throw AppError.internalServer("Error al verificar el token");
    }
  }
}
