import { JobRoleDatasourceImpl, JobRoleRepositoryImpl } from "../../../infraestructure";
import { GetJobRoleController } from "../../../presentation";

import { GetJobRoleUseCase } from "../../use-cases";

export const makeGetJobRoleController = (): GetJobRoleController => {
  const jobRoleDatasource = new JobRoleDatasourceImpl();
  const jobRoleRepository = new JobRoleRepositoryImpl(jobRoleDatasource);

  const getJobRoleUseCase = new GetJobRoleUseCase(jobRoleRepository);

  return new GetJobRoleController(getJobRoleUseCase);
};
