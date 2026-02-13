import {
  AssistanceDatasourceImpl,
  AssistanceRepositoryImpl,
  FileRepositoryImpl,
  ImageProcessorService,
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { TakeAssistanceController } from "../../../presentation";

import { TakeAssistanceUseCase } from "../../use-cases";

export const makeTakeAssistanceController = (): TakeAssistanceController => {
  const assistanceDatasource = new AssistanceDatasourceImpl();
  const assistanceRepository = new AssistanceRepositoryImpl(assistanceDatasource);

  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const fileRepository = new FileRepositoryImpl(new ImageProcessorService());

  const takeAssistanceUseCase = new TakeAssistanceUseCase(
    assistanceRepository,
    teamRepository,
    userRepository,
    fileRepository
  );

  return new TakeAssistanceController(takeAssistanceUseCase);
};
