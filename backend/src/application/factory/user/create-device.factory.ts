import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { CreateDeviceController } from "../../../presentation";

import { CreateDeviceUseCase } from "../../use-cases";

export const makeCreateDeviceController = (): CreateDeviceController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const useCase = new CreateDeviceUseCase(userRepository);

  return new CreateDeviceController(useCase);
};
