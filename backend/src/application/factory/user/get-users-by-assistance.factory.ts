import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { GetUsersByAssistanceCurrentDayController } from "../../../presentation";

import { GetUsersByAssistanceCurrentDayUseCase } from "../../use-cases";

export const makeGetUsersByAssistanceCurrentDayController = (): GetUsersByAssistanceCurrentDayController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const useCase = new GetUsersByAssistanceCurrentDayUseCase(userRepository);

  return new GetUsersByAssistanceCurrentDayController(useCase);
};
