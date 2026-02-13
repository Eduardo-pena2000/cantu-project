import { ICreateJobRoleRequest, JobRoleEntity, JobRoleRepository } from "../../../domain";

export class CreateJobRoleUseCase {
  constructor(private jobRoleRepository: JobRoleRepository) {}

  async execute(request: ICreateJobRoleRequest): Promise<JobRoleEntity> {
    const { body } = request;

    const { name, store_id } = body;

    const data = await this.jobRoleRepository.create({ name, store_id });

    return data;
  }
}
