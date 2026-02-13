import { Op } from "sequelize";

import { IGetStoresRequest, StoreEntity, StoreRepository } from "../../../domain";
import { PaginatedResponse } from "../../../shared";

export class GetStoresUseCase {
  constructor(private storeRepository: StoreRepository) {}

  async execute(request: IGetStoresRequest): Promise<PaginatedResponse<StoreEntity>> {
    const {
      query: { limit, page, ...filters },
    } = request;

    const where: Record<string, any> = {};

    if (filters && filters.name) {
      where.name = {
        [Op.like]: `%${filters.name.trim()}%`,
      };
    }

    const stores = await this.storeRepository.findAll({ limit, page, where });

    return stores;
  }
}
