import { AreaDatasourceImpl, AreaRepositoryImpl } from "../../../infraestructure";
import { CreateAreaController } from "../../../presentation";

import { CreateAreaUseCase } from "../../use-cases";

export const makeCreateAreaController = (): CreateAreaController => {
  const areaDatasource = new AreaDatasourceImpl();
  const areaRepository = new AreaRepositoryImpl(areaDatasource);

  const createAreaUseCase = new CreateAreaUseCase(areaRepository);

  return new CreateAreaController(createAreaUseCase);
};
