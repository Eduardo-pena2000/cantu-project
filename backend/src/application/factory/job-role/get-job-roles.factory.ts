import { JobRoleDatasourceImpl, JobRoleRepositoryImpl } from "../../../infraestructure";
import { GetJobRolesController } from "../../../presentation";

import { GetJobRolesUseCase } from "../../use-cases";

export const makeGetJobRolesController = (): GetJobRolesController => {
  const jobRoleDatasource = new JobRoleDatasourceImpl();
  const jobRoleRepository = new JobRoleRepositoryImpl(jobRoleDatasource);

  const getJobRolesUseCase = new GetJobRolesUseCase(jobRoleRepository);

  return new GetJobRolesController(getJobRolesUseCase);
};
