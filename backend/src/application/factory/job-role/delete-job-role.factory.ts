import { JobRoleDatasourceImpl, JobRoleRepositoryImpl } from "../../../infraestructure";
import { DeleteJobRoleController } from "../../../presentation";

import { DeleteJobRoleUseCase } from "../../use-cases";

export const makeDeleteJobRoleController = (): DeleteJobRoleController => {
  const jobRoleDatasource = new JobRoleDatasourceImpl();
  const jobRoleRepository = new JobRoleRepositoryImpl(jobRoleDatasource);

  const deleteJobRoleUseCase = new DeleteJobRoleUseCase(jobRoleRepository);

  return new DeleteJobRoleController(deleteJobRoleUseCase);
};
