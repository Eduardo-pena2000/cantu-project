import {
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  ShiftDatasourceImpl,
  ShiftRepositoryImpl,
} from "../../../infraestructure";
import { DeleteUserOfTeamController } from "../../../presentation";

import { DeleteUserOfTeamUseCase } from "../../use-cases";

export const makeDeleteUserOfTeamController = (): DeleteUserOfTeamController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const deleteUserOfTeamUseCase = new DeleteUserOfTeamUseCase(teamRepository, shiftRepository);

  return new DeleteUserOfTeamController(deleteUserOfTeamUseCase);
};
