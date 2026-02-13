import { ActivitieAssignmentEntity, ActivitieRepository, IAssigmentActivitieRequest } from "../../../domain";

import { AppError } from "../../../shared";

export class AssignmentActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IAssigmentActivitieRequest): Promise<ActivitieAssignmentEntity> {
    const { body } = request;

    const { activitie_id, assistance_id, deadline } = body;

    const data = await this.activitieRepository.assignment({
      activitie_id,
      assistance_id,
      deadline,
    });

    const assignedActivitie = await this.activitieRepository.findAssignedActivitieById(data.id);

    if (!assignedActivitie) {
      throw AppError.notFound("La actividad asignada no existe.");
    }

    return assignedActivitie;
  }
}
