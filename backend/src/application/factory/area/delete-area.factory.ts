import { AreaDatasourceImpl, AreaRepositoryImpl } from "../../../infraestructure";
import { DeleteAreaController } from "../../../presentation";

import { DeleteAreaUseCase } from "../../use-cases";

export const makeDeleteAreaController = (): DeleteAreaController => {
  const areaDatasource = new AreaDatasourceImpl();
  const areaRepository = new AreaRepositoryImpl(areaDatasource);

  const deleteAreaUseCase = new DeleteAreaUseCase(areaRepository);

  return new DeleteAreaController(deleteAreaUseCase);
};
