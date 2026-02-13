import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { DeleteUserController } from "../../../presentation";

import { DeleteUserUseCase } from "../../use-cases";

export const makeDeleteUserController = (): DeleteUserController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  return new DeleteUserController(deleteUserUseCase);
};
