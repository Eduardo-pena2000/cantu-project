import { AppError } from "../../../shared";

import { IAssignUserTeamRequest } from "../../../domain/dtos";
import { ShiftRepository, TeamRepository, UserRepository } from "../../../domain/repositories";

export class AssignUsersToTeamUseCase {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: IAssignUserTeamRequest) {
    const { body } = request;

    const { team_id, user_id, working_days } = body;

    const team = await this.teamRepository.findById(team_id);

    if (!team) {
      throw AppError.notFound("El equipo no existe");
    }

    if (!team.is_active) {
      throw AppError.notFound("El equipo se encuentra concluido, por favor cree uno nuevo.");
    }

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw AppError.notFound("El usuario no existe");
    }

    if (!user.teams?.map((team) => team.id).includes(team_id)) {
      await this.teamRepository.assignUser(team_id, user_id);
    }

    if (await this.teamRepository.userHasActiveTeam(user_id, team_id)) {
      throw AppError.notFound("El usuario ya tiene horarios asignados con un equipo activo.");
    }

    const currentSchedulesIds = (await this.shiftRepository.findUserSchedules(user_id)).map(
      ({ schedule_id }) => schedule_id
    );

    const scheduleToAdd = working_days.filter((id) => !currentSchedulesIds.includes(id));
    const schedulesToRemove = currentSchedulesIds.filter((id) => !working_days.includes(id));

    if (scheduleToAdd.length > 0) {
      await Promise.all(
        scheduleToAdd.map(async (schedule) => {
          await this.shiftRepository.assignScheduleToUser(user_id, schedule, team_id);
        })
      );
    }

    if (schedulesToRemove.length > 0) {
      await Promise.all(
        schedulesToRemove.map(async (schedule) => {
          await this.shiftRepository.deleteUserSchedulesByTeam(user_id, schedule, team_id);
        })
      );
    }
  }
}
