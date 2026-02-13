import {
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  RoleDatasourceImpl,
  RoleRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { CreateTeamController } from "../../../presentation";

import { CreateTeamUseCase } from "../../use-cases";

export const makeCreateTeamController = (): CreateTeamController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const roleDatasource = new RoleDatasourceImpl();
  const roleRepository = new RoleRepositoryImpl(roleDatasource);

  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const createTeamUseCase = new CreateTeamUseCase(teamRepository, roleRepository, userRepository);

  return new CreateTeamController(createTeamUseCase);
};
