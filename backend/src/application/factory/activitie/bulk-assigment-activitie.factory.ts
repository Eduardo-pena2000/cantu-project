import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { BulkAssignmentActivitieController } from "../../../presentation";

import { BulkAssignmentActivitieUseCase } from "../../use-cases";

export const makeBulkAssignmentActivitieController = (): BulkAssignmentActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const useCase = new BulkAssignmentActivitieUseCase(activitieRepository);

  return new BulkAssignmentActivitieController(useCase);
};
