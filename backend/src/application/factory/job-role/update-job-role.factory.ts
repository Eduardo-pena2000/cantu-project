import { JobRoleDatasourceImpl, JobRoleRepositoryImpl } from "../../../infraestructure";
import { UpdateJobRoleController } from "../../../presentation";

import { UpdateJobRoleUseCase } from "../../use-cases";

export const makeUpdateJobRoleController = (): UpdateJobRoleController => {
  const jobRoleDatasource = new JobRoleDatasourceImpl();
  const jobRoleRepository = new JobRoleRepositoryImpl(jobRoleDatasource);

  const updateJobRoleUseCase = new UpdateJobRoleUseCase(jobRoleRepository);

  return new UpdateJobRoleController(updateJobRoleUseCase);
};
