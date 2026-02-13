import { RoleDatasourceImpl, RoleRepositoryImpl } from "../../../infraestructure";
import { GetRolesController } from "../../../presentation";

import { GetRolesUseCase } from "../../use-cases";

export const makeGetRolesController = (): GetRolesController => {
  const storeDatasource = new RoleDatasourceImpl();
  const storeRepository = new RoleRepositoryImpl(storeDatasource);

  const getRolesUseCase = new GetRolesUseCase(storeRepository);

  return new GetRolesController(getRolesUseCase);
};
