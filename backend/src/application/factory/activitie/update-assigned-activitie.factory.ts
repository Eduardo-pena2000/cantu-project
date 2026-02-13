import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { UpdateAssignedActivitieController } from "../../../presentation";

import { UpdateAssignedActivitieUseCase } from "../../use-cases";

export const makeUpdateAssignedActivitieController = (): UpdateAssignedActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const useCase = new UpdateAssignedActivitieUseCase(activitieRepository);

  return new UpdateAssignedActivitieController(useCase);
};
