import { UserEntity } from "./user.entity";

export class RoleEntity {
  constructor(public id: number, public name: string, public slug: string, public users: UserEntity[]) {}

  static fromObject(object: { [key: string]: any }): RoleEntity {
    const { id, name, slug, users } = object;

    return new RoleEntity(id, name, slug, users);
  }
}
