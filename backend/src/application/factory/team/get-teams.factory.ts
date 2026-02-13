import { TeamDatasourceImpl, TeamRepositoryImpl } from "../../../infraestructure";
import { GetTeamsController } from "../../../presentation";

import { GetTeamsUseCase } from "../../use-cases";

export const makeGetTeamsController = (): GetTeamsController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const getTeamsUseCase = new GetTeamsUseCase(teamRepository);

  return new GetTeamsController(getTeamsUseCase);
};
