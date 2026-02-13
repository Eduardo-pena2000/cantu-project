import { ActivitieDatasourceImpl, ActivitieRepositoryImpl } from "../../../infraestructure";
import { UpdateActivitieNoteController } from "../../../presentation";

import { UpdateActivitieNoteUseCase } from "../../use-cases";

export const makeUpdateActivitieNoteController = (): UpdateActivitieNoteController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const useCase = new UpdateActivitieNoteUseCase(activitieRepository);

  return new UpdateActivitieNoteController(useCase);
};
