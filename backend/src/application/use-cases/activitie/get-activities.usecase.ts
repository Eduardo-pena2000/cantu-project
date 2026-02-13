import { Op } from "sequelize";

import { ActivitieEntity, ActivitieRepository, IGetActivitiesRequest } from "../../../domain";
import { PaginatedResponse } from "../../../shared";

export class GetActivitiesUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IGetActivitiesRequest): Promise<PaginatedResponse<ActivitieEntity>> {
    const {
      query: { limit, page, ...filters },
    } = request;

    const where: Record<string, any> = {};

    if (filters) {
      if (filters.name) {
        where.name = {
          [Op.like]: `%${filters.name.trim()}%`,
        };
      }

      if (filters.job_role) {
        where.job_role_id = filters.job_role;
      }
    }

    const stores = await this.activitieRepository.findAll({ limit, page, where });

    return stores;
  }
}
