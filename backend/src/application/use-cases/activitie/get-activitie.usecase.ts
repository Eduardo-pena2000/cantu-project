import { ActivitieEntity, ActivitieRepository, IGetActivitieRequest } from "../../../domain";

import { AppError } from "../../../shared";

export class GetActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IGetActivitieRequest): Promise<ActivitieEntity> {
    const { params } = request;

    const activitie = await this.activitieRepository.findById(params.id);

    if (!activitie) {
      throw AppError.notFound("La actividad no existe");
    }

    return activitie;
  }
}
