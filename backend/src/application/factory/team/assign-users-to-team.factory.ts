import {
  ShiftDatasourceImpl,
  ShiftRepositoryImpl,
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { AssignUsersToTeamController } from "../../../presentation";

import { AssignUsersToTeamUseCase } from "../../use-cases";

export const makeAssignUsersToTeamController = (): AssignUsersToTeamController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const createTeamUseCase = new AssignUsersToTeamUseCase(teamRepository, shiftRepository, userRepository);

  return new AssignUsersToTeamController(createTeamUseCase);
};
