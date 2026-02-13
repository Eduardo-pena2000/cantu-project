import { UserDatasourceImpl } from "../../../infraestructure/datasources";
import { UserRepositoryImpl } from "../../../infraestructure/repositories";

import { LoginController } from "../../../presentation";

import { LoginUseCase } from "../../use-cases";

export const makeLoginController = (): LoginController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const loginUseCase = new LoginUseCase(userRepository);

  const data = new LoginController(loginUseCase);

  return data;
};
