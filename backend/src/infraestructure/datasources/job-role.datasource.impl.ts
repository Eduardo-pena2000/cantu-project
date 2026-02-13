import { FindOptions } from "sequelize";

import {
  CreateJobRoleDto,
  IGetJobRolesParams,
  JobRoleDatasource,
  JobRoleEntity,
} from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import JobRole from "../database/models/job-role.model";
import Activitie from "../database/models/activitie.model";

export class JobRoleDatasourceImpl implements JobRoleDatasource {
  private paginator: Paginator<JobRole>;

  constructor() {
    this.paginator = new Paginator(JobRole);
  }

  async create(data: CreateJobRoleDto): Promise<JobRoleEntity> {
    const jobRole = await JobRole.create(data);

    return JobRoleEntity.fromObject(jobRole);
  }

  async delete(id: number): Promise<void> {
    await JobRole.destroy({ where: { id } });
  }

  async findAll({
    limit,
    page,
    where,
  }: IGetJobRolesParams): Promise<PaginatedResponse<JobRoleEntity>> {
    const optionsQuery: FindOptions = {
      attributes: ["id", "name", "code", "createdAt"],
      order: [["id", "DESC"]],
      where,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(JobRoleEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findAllByArea(area_id: number): Promise<JobRoleEntity[]> {
    const jobRoles = await JobRole.findAll({
      attributes: ["id", "name", "code"],
      include: [
        {
          as: "activities",
          attributes: ["id", "name", "description"],
          model: Activitie,
          where: { area_id },
        },
      ],
    });

    return jobRoles.map(JobRoleEntity.fromObject);
  }

  async findById(id: number): Promise<JobRoleEntity | null> {
    const jobRole = await JobRole.findOne({
      attributes: ["id", "name", "code", "createdAt"],
      where: { id },
    });

    return jobRole ? JobRoleEntity.fromObject(jobRole) : null;
  }

  async update(id: number, data: Partial<CreateJobRoleDto>): Promise<void> {
    await JobRole.update(data, { where: { id } });
  }
}
