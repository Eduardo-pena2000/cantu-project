import { AreaDatasourceImpl, AreaRepositoryImpl } from "../../../infraestructure";
import { GetAreaController } from "../../../presentation";

import { GetAreaUseCase } from "../../use-cases";

export const makeGetAreaController = (): GetAreaController => {
  const areaDatasource = new AreaDatasourceImpl();
  const areaRepository = new AreaRepositoryImpl(areaDatasource);

  const getAreaUseCase = new GetAreaUseCase(areaRepository);

  return new GetAreaController(getAreaUseCase);
};
