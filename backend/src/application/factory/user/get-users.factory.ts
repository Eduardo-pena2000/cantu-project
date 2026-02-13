import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { GetUsersController } from "../../../presentation";

import { GetUsersUseCase } from "../../use-cases";

export const makeGetUsersController = (): GetUsersController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const getUsersUseCase = new GetUsersUseCase(userRepository);

  return new GetUsersController(getUsersUseCase);
};
