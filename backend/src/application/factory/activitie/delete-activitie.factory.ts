import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { DeleteActivitieController } from "../../../presentation";

import { DeleteActivitieUseCase } from "../../use-cases";

export const makeDeleteActivitieController = (): DeleteActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const deleteActivitieUseCase = new DeleteActivitieUseCase(activitieRepository);

  return new DeleteActivitieController(deleteActivitieUseCase);
};
