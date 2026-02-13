import { UserDatasourceImpl, UserRepositoryImpl } from "../../../infraestructure";
import { GetAssignedActivitiesFromUsersController } from "../../../presentation";

import { GetAssignedActivitiesFromUsersUseCase } from "../../use-cases";

export const makeGetAssignedActivitiesFromUsersController = (): GetAssignedActivitiesFromUsersController => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const useCase = new GetAssignedActivitiesFromUsersUseCase(userRepository);

  return new GetAssignedActivitiesFromUsersController(useCase);
};
