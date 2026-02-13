import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { GetActivitieController } from "../../../presentation";

import { GetActivitieUseCase } from "../../use-cases";

export const makeGetActivitieController = (): GetActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const getActivitieUseCase = new GetActivitieUseCase(activitieRepository);

  return new GetActivitieController(getActivitieUseCase);
};
