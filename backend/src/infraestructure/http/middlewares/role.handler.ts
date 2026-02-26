
import { NextFunction, Response } from "express";

import { AppError, CustomRequest } from "../../../shared";
import { Roles } from "../../../shared/constans";

export class RoleHandler {
    static hasRole(allowedRoles: Roles[]) {
        return (req: CustomRequest, _res: Response, next: NextFunction) => {
            if (!req.user) {
                return next(AppError.internalServer("Se requiere AuthHandler antes de RoleHandler"));
            }

            const { roles } = req.user;

            // user.roles is an array of objects { id, name, slug } based on UserEntity
            // We need to check if any of the user's role IDs match the allowedRoles
            const hasRole = roles.some((userRole) => allowedRoles.includes(userRole.id));

            if (!hasRole) {
                return next(AppError.forbidden("No tienes permisos para realizar esta acción"));
            }

            next();
        };
    }
}
