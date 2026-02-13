import { AreaDatasourceImpl, AreaRepositoryImpl } from "../../../infraestructure";
import { GetAreasController } from "../../../presentation";

import { GetAreasUseCase } from "../../use-cases";

export const makeGetAreasController = (): GetAreasController => {
  const areaDatasource = new AreaDatasourceImpl();
  const areaRepository = new AreaRepositoryImpl(areaDatasource);

  const getAreasUseCase = new GetAreasUseCase(areaRepository);

  return new GetAreasController(getAreasUseCase);
};
