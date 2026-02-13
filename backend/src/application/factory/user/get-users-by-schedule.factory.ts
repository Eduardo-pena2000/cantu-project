import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { GetUsersByScheduleController } from "../../../presentation";

import { GetUsersByScheduleUseCase } from "../../use-cases";

export const makeGetUsersByScheduleController = (): GetUsersByScheduleController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const useCase = new GetUsersByScheduleUseCase(userRepository);

  return new GetUsersByScheduleController(useCase);
};
