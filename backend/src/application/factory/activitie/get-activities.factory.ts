import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { GetActivitiesController } from "../../../presentation";

import { GetActivitiesUseCase } from "../../use-cases";

export const makeGetActivitiesController = (): GetActivitiesController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const getActivitiesUseCase = new GetActivitiesUseCase(activitieRepository);

  return new GetActivitiesController(getActivitiesUseCase);
};
