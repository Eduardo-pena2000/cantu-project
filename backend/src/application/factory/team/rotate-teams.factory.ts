import {
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  ShiftDatasourceImpl,
  ShiftRepositoryImpl,
} from "../../../infraestructure";
import { RotateTeamsController } from "../../../presentation";

import { RotateTeamsUseCase } from "../../use-cases";

export const makeRotateTeamsController = (): RotateTeamsController => {
  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const rotateTeamsUseCase = new RotateTeamsUseCase(teamRepository, shiftRepository);

  return new RotateTeamsController(rotateTeamsUseCase);
};
