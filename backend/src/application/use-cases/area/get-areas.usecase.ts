import { Op } from "sequelize";

import { AreaEntity, AreaRepository, IGetAreasRequest } from "../../../domain";
import { PaginatedResponse } from "../../../shared";

export class GetAreasUseCase {
  constructor(private areaRepository: AreaRepository) {}

  async execute(request: IGetAreasRequest): Promise<PaginatedResponse<AreaEntity>> {
    const {
      query: { limit, page, ...filters },
    } = request;

    const where: Record<string, any> = {};

    if (filters && filters.name) {
      where.name = {
        [Op.like]: `%${filters.name.trim()}%`,
      };
    }

    if (filters && filters.store) {
      where.store_id = filters.store;
    }

    const areas = await this.areaRepository.findAll({ limit, page, where });

    return areas;
  }
}
