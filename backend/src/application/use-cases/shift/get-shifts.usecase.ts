import { Op } from "sequelize";

import { IGetShiftsRequest, ShiftEntity, ShiftRepository } from "../../../domain";

import { PaginatedResponse } from "../../../shared";

export class GetShiftsUseCase {
  constructor(private shiftRepository: ShiftRepository) {}

  async execute(request: IGetShiftsRequest): Promise<PaginatedResponse<ShiftEntity>> {
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
    }

    const shifts = await this.shiftRepository.findAll({ limit, page, where });

    return shifts;
  }
}
