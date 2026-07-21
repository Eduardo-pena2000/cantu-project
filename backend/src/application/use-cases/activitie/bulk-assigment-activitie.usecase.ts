import {
  ActivitieAssignmentEntity,
  ActivitieRepository,
  IBulkAssignmentActivitieRequest,
} from "../../../domain";

import { AppError } from "../../../shared";

export class BulkAssignmentActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(
    request: IBulkAssignmentActivitieRequest
  ): Promise<ActivitieAssignmentEntity[]> {
    const { body } = request;
    const { assistance_id, assignments } = body;

    if (!assignments || assignments.length === 0) {
      throw AppError.badRequest("Debe enviar al menos una actividad para asignar.");
    }

    const results = await this.activitieRepository.bulkAssignment({
      assistance_id,
      assignments,
    });

    return results;
  }
}
