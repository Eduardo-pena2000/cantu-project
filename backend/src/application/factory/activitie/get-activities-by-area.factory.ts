import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { GetActivitiesByAreaController } from "../../../presentation";

import { GetActivitiesByAreaUseCase } from "../../use-cases";

export const makeGetActivitiesByAreaController = (): GetActivitiesByAreaController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const getActivitiesByAreaUseCase = new GetActivitiesByAreaUseCase(activitieRepository);

  return new GetActivitiesByAreaController(getActivitiesByAreaUseCase);
};
