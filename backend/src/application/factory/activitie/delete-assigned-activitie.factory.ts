import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { DeleteAssignedActivitieController } from "../../../presentation";

import { DeleteAssignedActivitieUseCase } from "../../use-cases";

export const makeDeleteAssignedActivitieController = (): DeleteAssignedActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const deleteAssignedActivitieUseCase = new DeleteAssignedActivitieUseCase(activitieRepository);

  return new DeleteAssignedActivitieController(deleteAssignedActivitieUseCase);
};
