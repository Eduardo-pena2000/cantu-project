import { AppError, rolesWithAccessToApp } from "../../../shared";

import { AuthEntity } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories";

import { PasswordService, TokenService } from "../../../infraestructure/services";

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    const is_active = user?.roles.some((role) => rolesWithAccessToApp.includes(+role.id));

    if (!user) {
      throw AppError.unauthorized("Credenciales Inconrrectas");
    }

    if (!is_active) {
      throw AppError.unauthorized("Usuario no tiene acceso a la plataforma");
    }

    const isValid = await PasswordService.compare(password, user.password);

    if (!isValid) {
      throw AppError.unauthorized("Credenciales Inconrrectas");
    }

    const refresh_token: string = TokenService.generateRefreshToken();

    const access_token: string = TokenService.generateAccessToken({
      id: user.id,
    });

    await this.userRepository.update(user.id, {
      last_login: new Date(),
    });

    const { password: userPassword, ...userData } = user;

    return AuthEntity.fromObject({ user: userData, access_token, refresh_token });
  }
}
