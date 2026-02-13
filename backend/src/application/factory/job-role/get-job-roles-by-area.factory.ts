import { JobRoleDatasourceImpl, JobRoleRepositoryImpl } from "../../../infraestructure";
import { GetJobRolesByAreaController } from "../../../presentation";

import { GetJobRolesByAreaUseCase } from "../../use-cases";

export const makeGetJobRolesByAreaController = (): GetJobRolesByAreaController => {
  const jobRoleDatasource = new JobRoleDatasourceImpl();
  const jobRoleRepository = new JobRoleRepositoryImpl(jobRoleDatasource);

  const getJobRolesByAreaUseCase = new GetJobRolesByAreaUseCase(jobRoleRepository);

  return new GetJobRolesByAreaController(getJobRolesByAreaUseCase);
};
