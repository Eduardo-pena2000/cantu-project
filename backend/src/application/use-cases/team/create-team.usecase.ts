import { AppError, Roles } from "../../../shared";

import { ICreateTeamRequest, RoleRepository, TeamEntity, TeamRepository } from "../../../domain";
import { UserRepository } from "../../../domain/repositories/user.repository";

import { PasswordService } from "../../../infraestructure/services";

export class CreateTeamUseCase {
  constructor(
    private teamRepository: TeamRepository,
    private roleRepository: RoleRepository,
    private userRepository: UserRepository
  ) { }

  async execute(request: ICreateTeamRequest): Promise<TeamEntity> {
    const { body } = request;

    const { shift_id, name, store_id, manager_id, temporal_manager } = body;

    const team = await this.teamRepository.findByActiveShift(shift_id);

    if (team) {
      throw AppError.notFound("Ya existe un equipo activo con este turno activo.");
    }

    const data = await this.teamRepository.create({ name, shift_id, store_id });

    if (manager_id) {
      await this.teamRepository.assignManager({
        team_id: data.id,
        user_id: manager_id,
        is_main_manager: true,
      });

      await this.teamRepository.assignUser(data.id, manager_id);

      const manager = await this.userRepository.findById(manager_id);

      const managerRoles = manager?.roles.map((role) => role.id)!;

      if (!managerRoles.includes(Roles.shift_manager)) {
        await this.roleRepository.assignToUser(Roles.shift_manager, manager_id);
      }

      // Update password to match username
      if (manager && manager.username) {
        const password = await PasswordService.hash(manager.username.trim());
        await this.userRepository.update(manager.id, { password });
      }
    }

    if (temporal_manager) {
      await this.teamRepository.assignManager({
        team_id: data.id,
        user_id: temporal_manager.id,
        end_date: temporal_manager.end_date,
        start_date: temporal_manager.start_date,
      });

      await this.teamRepository.assignUser(data.id, temporal_manager.id);

      const temporal = await this.userRepository.findById(temporal_manager.id);

      const temporalRoles = temporal?.roles.map((role) => role.id)!;

      if (!temporalRoles.includes(Roles.temporary_shift_manager)) {
        await this.roleRepository.assignToUser(Roles.shift_manager, temporal_manager.id);
      }

      // Update password to match username for temporal manager too
      if (temporal && temporal.username) {
        const password = await PasswordService.hash(temporal.username.trim());
        await this.userRepository.update(temporal.id, { password });
      }
    }

    return data;
  }
}
