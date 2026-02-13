import {
  FileRepositoryImpl,
  ImageProcessorService,
  RoleDatasourceImpl,
  RoleRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { CreateUserController } from "../../../presentation";

import { CreateUserUseCase } from "../../use-cases";

export const makeCreateUserController = (): CreateUserController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const roleDatasource = new RoleDatasourceImpl();
  const roleRepository = new RoleRepositoryImpl(roleDatasource);

  const fileRepository = new FileRepositoryImpl(new ImageProcessorService());

  const createUserUseCase = new CreateUserUseCase(userRepository, roleRepository, fileRepository);

  return new CreateUserController(createUserUseCase);
};
