import { IGetStoreRequest, TeamEntity, TeamRepository } from "../../../domain";

import { AppError } from "../../../shared";

export class GetTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(request: IGetStoreRequest): Promise<TeamEntity> {
    const { params } = request;

    const team = await this.teamRepository.findById(params.id);

    if (!team) {
      throw AppError.notFound("El equipo no existe");
    }

    return team;
  }
}
