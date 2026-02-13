import { IUpdateTeamRequest, RoleRepository, TeamRepository, UserRepository } from "../../../domain";

import { AppError, Roles } from "../../../shared";

export class UpdateTeamUseCase {
  constructor(
    private teamRepository: TeamRepository,
    private roleRepository: RoleRepository,
    private userRepository: UserRepository
  ) {}

  async execute(request: IUpdateTeamRequest): Promise<void> {
    const { body, params } = request;

    const { name, shift_id, store_id, manager_id, temporal_manager } = body;

    const team = await this.findAndValidateTeam(params.id);

    await this.handleMainManager(team, manager_id);

    await this.handleTemporalManager(team, temporal_manager);

    await this.updateTeamDetails(team.id, { name, shift_id, store_id });
  }

  private async findAndValidateTeam(teamId: number) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw AppError.notFound("El equipo no existe");
    }

    return team;
  }

  private async handleMainManager(team: any, newManagerId?: number) {
    const currentManager = team.managers?.find((manager: any) => manager.manager_info?.is_main_manager);

    if (currentManager?.id !== newManagerId) {
      const manager = await this.userRepository.findById(newManagerId!);

      if (currentManager) {
        await this.teamRepository.deleteManager(team.id, currentManager.id);

        await this.teamRepository.deleteUser(team.id, currentManager.id);

        await this.roleRepository.deleteToUser(Roles.shift_manager, currentManager.id);
      }

      if (newManagerId) {
        await this.teamRepository.assignManager({
          team_id: team.id,
          user_id: newManagerId,
          is_main_manager: true,
        });

        await this.teamRepository.assignUser(team.id, newManagerId);

        const managerRoles = manager?.roles.map((role) => role.id)!;

        if (!managerRoles.includes(Roles.shift_manager)) {
          await this.roleRepository.assignToUser(Roles.shift_manager, newManagerId);
        }
      }
    }
  }

  private async handleTemporalManager(team: any, newTemporalManager?: any) {
    const currentTemporalManager = team.managers?.find((manager: any) => !manager.manager_info?.is_main_manager);

    if (currentTemporalManager?.id !== newTemporalManager?.id) {
      const temporal = await this.userRepository.findById(newTemporalManager.id);

      if (currentTemporalManager) {
        await this.teamRepository.deleteManager(team.id, currentTemporalManager.id);

        await this.teamRepository.deleteUser(team.id, currentTemporalManager.id);

        await this.roleRepository.deleteToUser(Roles.temporary_shift_manager, currentTemporalManager.id);
      }

      if (newTemporalManager) {
        await this.teamRepository.assignManager({
          team_id: team.id,
          user_id: newTemporalManager.id,
          end_date: newTemporalManager.end_date,
          start_date: newTemporalManager.start_date,
        });

        await this.teamRepository.assignUser(team.id, newTemporalManager.id);

        const temporalRoles = temporal?.roles.map((role) => role.id)!;

        if (!temporalRoles.includes(Roles.temporary_shift_manager)) {
          await this.roleRepository.assignToUser(Roles.temporary_shift_manager, newTemporalManager.id);
        }
      }
    }
  }

  private async updateTeamDetails(teamId: number, details: any) {
    await this.teamRepository.update(teamId, details);
  }
}
