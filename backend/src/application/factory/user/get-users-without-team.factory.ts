import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { GetUsersWithoutTeamController } from "../../../presentation";

import { GetUsersWithoutTeamUseCase } from "../../use-cases";

export const makeGetUsersWithoutTeamController = (): GetUsersWithoutTeamController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const useCase = new GetUsersWithoutTeamUseCase(userRepository);

  return new GetUsersWithoutTeamController(useCase);
};
