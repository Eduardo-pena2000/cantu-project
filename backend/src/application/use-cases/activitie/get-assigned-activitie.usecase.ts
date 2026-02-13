import { ActivitieAssignmentEntity, ActivitieRepository, IGetActivitieRequest } from "../../../domain";

import { AppError } from "../../../shared";

export class GetAssignedActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IGetActivitieRequest): Promise<ActivitieAssignmentEntity> {
    const { params } = request;

    const activitie = await this.activitieRepository.findAssignedActivitieById(params.id);

    if (!activitie) {
      throw AppError.notFound("La actividad asignada no existe");
    }

    return activitie;
  }
}
