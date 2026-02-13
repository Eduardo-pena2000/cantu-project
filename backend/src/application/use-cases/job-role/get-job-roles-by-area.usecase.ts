import { JobRoleEntity } from "../../../domain";

import { JobRoleRepository } from "../../../domain/repositories/job-role.repository";

export class GetJobRolesByAreaUseCase {
  constructor(private jobRoleRepository: JobRoleRepository) {}

  async execute(area_id: number): Promise<JobRoleEntity[]> {
    const jobRoles = await this.jobRoleRepository.findAllByArea(area_id);

    return jobRoles;
  }
}
