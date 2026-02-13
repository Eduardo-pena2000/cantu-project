import { JobRoleDatasourceImpl, JobRoleRepositoryImpl } from "../../../infraestructure";
import { CreateJobRoleController } from "../../../presentation";

import { CreateJobRoleUseCase } from "../../use-cases";

export const makeCreateJobRoleController = (): CreateJobRoleController => {
  const jobRoleDatasource = new JobRoleDatasourceImpl();
  const jobRoleRepository = new JobRoleRepositoryImpl(jobRoleDatasource);

  const createJobRoleUseCase = new CreateJobRoleUseCase(jobRoleRepository);

  return new CreateJobRoleController(createJobRoleUseCase);
};
