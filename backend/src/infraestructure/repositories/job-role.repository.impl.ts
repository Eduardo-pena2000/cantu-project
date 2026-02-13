import {
  CreateJobRoleDto,
  IGetJobRolesParams,
  JobRoleDatasource,
  JobRoleEntity,
  JobRoleRepository,
} from "../../domain";

import { PaginatedResponse } from "../../shared";

export class JobRoleRepositoryImpl implements JobRoleRepository {
  constructor(private datasource: JobRoleDatasource) {}

  async create(data: CreateJobRoleDto): Promise<JobRoleEntity> {
    return await this.datasource.create(data);
  }

  async delete(id: number): Promise<void> {
    return await this.datasource.delete(id);
  }

  async findAll(params: IGetJobRolesParams): Promise<PaginatedResponse<JobRoleEntity>> {
    return await this.datasource.findAll(params);
  }

  async findById(id: number): Promise<JobRoleEntity | null> {
    return await this.datasource.findById(id);
  }

  async findAllByArea(area_id: number): Promise<JobRoleEntity[]> {
    return await this.datasource.findAllByArea(area_id);
  }

  async update(id: number, data: Partial<CreateJobRoleDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }
}
