import { AppError } from "../../../shared";
import { IUpdateAssignedActivitieRequest } from "../../../domain/dtos";
import { ActivitieAssignmentEntity } from "../../../domain/entities";
import { ActivitieRepository } from "../../../domain/repositories";

export class UpdateAssignedActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IUpdateAssignedActivitieRequest): Promise<ActivitieAssignmentEntity> {
    const { body, params } = request;

    const { assistance_id, activitie_id, deadline } = body;

    const data = await this.activitieRepository.updateAssignedActivitie(params.id, {
      assistance_id,
      activitie_id,
      deadline,
    });

    const assignedActivitie = await this.activitieRepository.findAssignedActivitieById(data.id);

    if (!assignedActivitie) {
      throw AppError.notFound("La actividad asignada no existe.");
    }

    return assignedActivitie;
  }
}
