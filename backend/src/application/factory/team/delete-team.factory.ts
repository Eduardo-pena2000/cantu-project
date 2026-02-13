import { TeamDatasourceImpl, TeamRepositoryImpl } from "../../../infraestructure";
import { DeleteTeamController } from "../../../presentation";

import { DeleteTeamUseCase } from "../../use-cases";

export const makeDeleteTeamController = (): DeleteTeamController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);

  return new DeleteTeamController(deleteTeamUseCase);
};
