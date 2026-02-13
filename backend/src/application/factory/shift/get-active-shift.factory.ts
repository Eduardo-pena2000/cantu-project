import {
  ShiftDatasourceImpl,
  ShiftRepositoryImpl,
  TeamDatasourceImpl,
  TeamRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";
import { GetActiveScheduleController } from "../../../presentation";

import { GetActiveShiftUseCase } from "../../use-cases";

export const makeGetActiveScheduleController = (): GetActiveScheduleController => {
  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const teamDatasource = new TeamDatasourceImpl();
  const teamRepository = new TeamRepositoryImpl(teamDatasource);

  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const getActiveShiftUseCase = new GetActiveShiftUseCase(shiftRepository, teamRepository, userRepository);

  return new GetActiveScheduleController(getActiveShiftUseCase);
};
