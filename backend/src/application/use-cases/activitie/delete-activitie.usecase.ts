import { ActivitieRepository, IDeleteActivitieRequest } from "../../../domain";

import { AppError } from "../../../shared";

export class DeleteActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IDeleteActivitieRequest): Promise<void> {
    const { params } = request;

    const activitie = await this.activitieRepository.findById(params.id);

    if (!activitie) {
      throw AppError.notFound("La actividad no existe");
    }

    await this.activitieRepository.delete(params.id);
  }
}
