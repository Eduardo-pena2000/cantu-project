import { AreaDatasourceImpl, AreaRepositoryImpl } from "../../../infraestructure";
import { AssignAreaToUsersController } from "../../../presentation";

import { AssignAreaToUsersUseCase } from "../../use-cases";

export const makeAssignAreaToUsersController = (): AssignAreaToUsersController => {
  const areaDatasource = new AreaDatasourceImpl();
  const areaRepository = new AreaRepositoryImpl(areaDatasource);

  const createUserUseCase = new AssignAreaToUsersUseCase(areaRepository);

  return new AssignAreaToUsersController(createUserUseCase);
};
