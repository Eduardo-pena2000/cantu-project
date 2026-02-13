import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { AssignmentActivitieController } from "../../../presentation";

import { AssignmentActivitieUseCase } from "../../use-cases";

export const makeAssigmentActivitieController = (): AssignmentActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const useCase = new AssignmentActivitieUseCase(activitieRepository);

  return new AssignmentActivitieController(useCase);
};
