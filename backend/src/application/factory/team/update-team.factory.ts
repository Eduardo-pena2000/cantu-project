import {
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  RoleDatasourceImpl,
  RoleRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { UpdateTeamController } from "../../../presentation";

import { UpdateTeamUseCase } from "../../use-cases";

export const makeUpdateTeamController = (): UpdateTeamController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const roleDatasource = new RoleDatasourceImpl();
  const roleRepository = new RoleRepositoryImpl(roleDatasource);

  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const updateTeamUseCase = new UpdateTeamUseCase(teamRepository, roleRepository, userRepository);

  return new UpdateTeamController(updateTeamUseCase);
};
