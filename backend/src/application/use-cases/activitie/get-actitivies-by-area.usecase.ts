import { PaginatedResponse } from "../../../shared";
import { IGetActivitiesByAreaRequest, IGetActivitiesRequest } from "../../../domain/dtos";
import { ActivitieEntity } from "../../../domain/entities";
import { ActivitieRepository } from "../../../domain/repositories";

export class GetActivitiesByAreaUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IGetActivitiesByAreaRequest): Promise<PaginatedResponse<ActivitieEntity>> {
    const {
      query: { limit, page },
      params: { id },
    } = request;

    const where: Record<string, any> = { area_id: id };

    const activities = await this.activitieRepository.findAllByArea({ limit, page, where });

    return activities;
  }
}
