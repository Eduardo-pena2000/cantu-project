import { RoleEntity, RoleRepository } from "../../../domain";

export class GetRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute(): Promise<RoleEntity[]> {
    const roles = await this.roleRepository.findAll();

    return roles;
  }
}
