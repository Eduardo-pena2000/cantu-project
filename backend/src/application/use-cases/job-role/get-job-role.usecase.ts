import { IGetJobRoleRequest, JobRoleEntity, JobRoleRepository } from "../../../domain";

import { AppError } from "../../../shared";

export class GetJobRoleUseCase {
  constructor(private jobRoleRepository: JobRoleRepository) {}

  async execute(request: IGetJobRoleRequest): Promise<JobRoleEntity> {
    const { params } = request;

    const jobRole = await this.jobRoleRepository.findById(params.id);

    if (!jobRole) {
      throw AppError.notFound("El Rol de Trabajo no existe");
    }

    return jobRole;
  }
}
