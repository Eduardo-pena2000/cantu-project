import { ActivitieEntity, ActivitieRepository, ICreateActivitieRequest } from "../../../domain";

export class CreateActivitieUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: ICreateActivitieRequest): Promise<ActivitieEntity> {
    const { body } = request;

    const { area_id, description, job_role_id, name } = body;

    const data = await this.activitieRepository.create({
      area_id,
      description,
      job_role_id,
      name,
    });

    return data;
  }
}
