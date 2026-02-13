import { IDeleteUserOfTeamRequest, ShiftRepository, TeamRepository } from "../../../domain";

import { AppError } from "../../../shared";

export class DeleteUserOfTeamUseCase {
  constructor(private teamRepository: TeamRepository, private shiftRepository: ShiftRepository) {}

  async execute(request: IDeleteUserOfTeamRequest): Promise<void> {
    const { params } = request;

    const team = await this.teamRepository.findById(+params.teamId);

    if (!team) {
      throw AppError.notFound("El equipo no existe");
    }

    await this.teamRepository.deleteUser(+params.teamId, +params.userId);

    await this.shiftRepository.deleteUserSchedule(+params.userId);
  }
}
