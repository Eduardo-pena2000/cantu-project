import { ActivitieRepository, IUpdateActivitieRequest } from "../../../domain";

import { AppError } from "../../../shared";

export class UpdateActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IUpdateActivitieRequest): Promise<void> {
    const { body, params } = request;

    const { area_id, description, job_role_id, name } = body;

    const activitie = await this.activitieRepository.findById(params.id);

    if (!activitie) {
      throw AppError.notFound("Tienda no existe");
    }

    await this.activitieRepository.update(activitie.id, {
      area_id,
      description,
      job_role_id,
      name,
    });
  }
}
