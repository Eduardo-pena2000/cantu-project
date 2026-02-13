import { IDeleteJobRoleRequest, JobRoleRepository } from "../../../domain";

import { AppError } from "../../../shared";

export class DeleteJobRoleUseCase {
  constructor(private jobRoleRepository: JobRoleRepository) {}

  async execute(request: IDeleteJobRoleRequest): Promise<void> {
    const { params } = request;

    const jobRole = await this.jobRoleRepository.findById(params.id);

    if (!jobRole) {
      throw AppError.notFound("El Rol de Trabajo no existe");
    }

    await this.jobRoleRepository.delete(params.id);
  }
}
