import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { UpdateActivitieController } from "../../../presentation";

import { UpdateActivitieUseCase } from "../../use-cases";

export const makeUpdateActivitieController = (): UpdateActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const updateActivitieUseCase = new UpdateActivitieUseCase(activitieRepository);

  return new UpdateActivitieController(updateActivitieUseCase);
};
