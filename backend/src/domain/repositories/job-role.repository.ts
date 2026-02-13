import { PaginatedResponse } from "../../shared";

import { CreateJobRoleDto, IGetJobRolesParams } from "../dtos";
import { JobRoleEntity } from "../entities";

export abstract class JobRoleRepository {
  abstract create(data: CreateJobRoleDto): Promise<JobRoleEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findAll(params: IGetJobRolesParams): Promise<PaginatedResponse<JobRoleEntity>>;
  abstract findAllByArea(area_id: number): Promise<JobRoleEntity[]>;
  abstract findById(id: number): Promise<JobRoleEntity | null>;
  abstract update(id: number, data: Partial<CreateJobRoleDto>): Promise<void>;
}
