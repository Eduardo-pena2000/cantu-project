import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { CreateActivitieController } from "../../../presentation";

import { CreateActivitieUseCase } from "../../use-cases";

export const makeCreateActivitieController = (): CreateActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const createActivitieUseCase = new CreateActivitieUseCase(activitieRepository);

  return new CreateActivitieController(createActivitieUseCase);
};
