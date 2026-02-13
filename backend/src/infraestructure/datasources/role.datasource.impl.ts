import { RoleDatasource, RoleEntity } from "../../domain";

import Role from "../database/models/role.model";
import UserRole from "../database/models/user-role.model";
import User from "../database/models/user.model";

export class RoleDatasourceImpl implements RoleDatasource {
  async assignToUser(role_id: number, user_id: number): Promise<void> {
    await UserRole.create({ role_id, user_id });
  }

  async deleteAllToUser(user_id: number): Promise<void> {
    await UserRole.destroy({ where: { user_id } });
  }

  async deleteToUser(role_id: number, user_id: number): Promise<void> {
    await UserRole.destroy({ where: { role_id, user_id } });
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await Role.findAll({
      attributes: ["id", "name"],
    });

    return roles.map(RoleEntity.fromObject);
  }

  async findBySlug(slug: string): Promise<RoleEntity | null> {
    const role = await Role.findOne({
      attributes: ["id", "name", "slug"],
      include: [{ as: "users", attributes: ["id"], model: User, through: { attributes: [] } }],
      where: { slug },
    });

    return role ? RoleEntity.fromObject(role) : null;
  }

  async updateToUser(role_id: number, user_id: number): Promise<void> {
    await UserRole.findOrCreate({
      where: { role_id, user_id },
      defaults: { role_id, user_id },
    });
  }
}
