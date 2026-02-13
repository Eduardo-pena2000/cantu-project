import { RoleDatasource, RoleEntity, RoleRepository } from "../../domain";

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly datasource: RoleDatasource) {}

  async assignToUser(role_id: number, user_id: number): Promise<void> {
    return await this.datasource.assignToUser(role_id, user_id);
  }

  async deleteAllToUser(user_id: number): Promise<void> {
    return await this.datasource.deleteAllToUser(user_id);
  }

  async deleteToUser(role_id: number, user_id: number): Promise<void> {
    return await this.datasource.deleteToUser(role_id, user_id);
  }

  async findAll(): Promise<RoleEntity[]> {
    return await this.datasource.findAll();
  }

  async findBySlug(slug: string): Promise<RoleEntity | null> {
    return this.datasource.findBySlug(slug);
  }

  async updateToUser(role_id: number, user_id: number): Promise<void> {
    return await this.datasource.updateToUser(role_id, user_id);
  }
}
