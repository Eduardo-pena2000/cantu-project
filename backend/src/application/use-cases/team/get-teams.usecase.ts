import { Op } from "sequelize";

import { IGetTeamsRequest, TeamEntity, TeamRepository } from "../../../domain";

import { PaginatedResponse } from "../../../shared";

export class GetTeamsUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(request: IGetTeamsRequest): Promise<PaginatedResponse<TeamEntity>> {
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

      if (filters.store) {
        where.store_id = +filters.store;
      }

      if (filters.is_active) {
        where.is_active = Boolean(filters.is_active);
      }
    }

    const stores = await this.teamRepository.findAll({ limit, page, where });

    return stores;
  }
}
