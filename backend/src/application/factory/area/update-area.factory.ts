import { AreaDatasourceImpl, AreaRepositoryImpl } from "../../../infraestructure";
import { UpdateAreaController } from "../../../presentation";

import { UpdateAreaUseCase } from "../../use-cases";

export const makeUpdateAreaController = (): UpdateAreaController => {
  const areaDatasource = new AreaDatasourceImpl();
  const areaRepository = new AreaRepositoryImpl(areaDatasource);

  const updateAreaUseCase = new UpdateAreaUseCase(areaRepository);

  return new UpdateAreaController(updateAreaUseCase);
};
