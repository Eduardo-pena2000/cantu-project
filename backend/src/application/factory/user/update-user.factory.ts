import {
  FileRepositoryImpl,
  ImageProcessorService,
  RoleDatasourceImpl,
  RoleRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { UpdateUserController } from "../../../presentation";

import { UpdateUserUseCase } from "../../use-cases";

export const makeUpdateUserController = (): UpdateUserController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const roleDatasource = new RoleDatasourceImpl();
  const roleRepository = new RoleRepositoryImpl(roleDatasource);

  const fileRepository = new FileRepositoryImpl(new ImageProcessorService());

  const updateUserUseCase = new UpdateUserUseCase(userRepository, roleRepository, fileRepository);

  return new UpdateUserController(updateUserUseCase);
};
