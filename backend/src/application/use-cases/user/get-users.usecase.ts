import { Op } from "sequelize";

import { IGetUsersRequest, UserEntity, UserRepository } from "../../../domain";

import { PaginatedResponse } from "../../../shared";

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: IGetUsersRequest): Promise<PaginatedResponse<UserEntity>> {
    const {
      query: { limit, page, ...filters },
    } = request;

    const where: Record<string, any> = {};

    if (filters) {
      if (filters.name) {
        (where as any)[Op.or] = [
          { names: { [Op.like]: `%${filters.name.trim()}%` } },
          { last_names: { [Op.like]: `%${filters.name.trim()}%` } },
        ];
      }

      if (filters.role) {
        Object.assign(where, {
          "$roles.id$": { [Op.in]: filters.role.map(Number) },
        });
      }

      if (filters.store) {
        Object.assign(where, {
          store_id: +filters.store,
        });
      }

      if (filters.area) {
        Object.assign(where, {
          "$areas.id$": +filters.area,
        });
      }
    }

    const users = await this.userRepository.findAll({ limit, page, where });

    return users;
  }
}
