import { Op } from "sequelize";

import { IGetJobRolesRequest, JobRoleEntity, JobRoleRepository } from "../../../domain";

import { PaginatedResponse } from "../../../shared";

export class GetJobRolesUseCase {
  constructor(private jobRoleRepository: JobRoleRepository) {}

  async execute(request: IGetJobRolesRequest): Promise<PaginatedResponse<JobRoleEntity>> {
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

    const jobRoles = await this.jobRoleRepository.findAll({ limit, page, where });

    return jobRoles;
  }
}
