import { TeamDatasourceImpl, TeamRepositoryImpl } from "../../../infraestructure";
import { GetTeamController } from "../../../presentation";

import { GetTeamUseCase } from "../../use-cases";

export const makeGetTeamController = (): GetTeamController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const getTeamUseCase = new GetTeamUseCase(teamRepository);

  return new GetTeamController(getTeamUseCase);
};
