import { IUpdateJobRoleRequest, JobRoleRepository } from "../../../domain";

import { AppError } from "../../../shared";

export class UpdateJobRoleUseCase {
  constructor(private jobRoleRepository: JobRoleRepository) {}

  async execute(request: IUpdateJobRoleRequest): Promise<void> {
    const { body, params } = request;

    const { name, store_id } = body;

    const jobRole = await this.jobRoleRepository.findById(params.id);

    if (!jobRole) {
      throw AppError.notFound("El Rol de Trabajo no existe");
    }

    await this.jobRoleRepository.update(jobRole.id, { name, store_id });
  }
}
