import { IDeleteTeamRequest, TeamRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class DeleteTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(request: IDeleteTeamRequest): Promise<void> {
    const { params } = request;

    const team = await this.teamRepository.findById(params.id);

    if (!team) {
      throw AppError.notFound("El equipo no existe");
    }

    await this.teamRepository.delete(params.id);
  }
}
