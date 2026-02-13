import { RoleEntity } from "../entities";

export abstract class RoleDatasource {
  abstract assignToUser(role_id: number, user_id: number): Promise<void>;
  abstract deleteAllToUser(user_id: number): Promise<void>;
  abstract deleteToUser(role_id: number, user_id: number): Promise<void>;
  abstract findAll(): Promise<RoleEntity[]>;
  abstract findBySlug(slug: string): Promise<RoleEntity | null>;
  abstract updateToUser(role_id: number, user_id: number): Promise<void>;
}
