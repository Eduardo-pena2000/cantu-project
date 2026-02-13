import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { GetAssignedActivitieController } from "../../../presentation";

import { GetAssignedActivitieUseCase } from "../../use-cases";

export const makeGetAssignedActivitieController = (): GetAssignedActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const getActivitieUseCase = new GetAssignedActivitieUseCase(activitieRepository);

  return new GetAssignedActivitieController(getActivitieUseCase);
};
