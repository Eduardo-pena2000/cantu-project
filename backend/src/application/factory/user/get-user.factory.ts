import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { GetUserController } from "../../../presentation";

import { GetUserUseCase } from "../../use-cases";

export const makeGetUserController = (): GetUserController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const getUserUseCase = new GetUserUseCase(userRepository);

  return new GetUserController(getUserUseCase);
};
