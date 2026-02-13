import { UserEntity } from "./user.entity";

export class AuthEntity {
  constructor(public user: UserEntity, public access_token: string, public refresh_token: string) {}

  static fromObject(object: { [key: string]: any }): AuthEntity {
    const { user, access_token, refresh_token } = object;

    return new AuthEntity(user, access_token, refresh_token);
  }
}
