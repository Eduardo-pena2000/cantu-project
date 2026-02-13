import { StoreDatasourceImpl, StoreRepositoryImpl } from "../../../infraestructure";
import { GetStoresController } from "../../../presentation";

import { GetStoresUseCase } from "../../use-cases";

export const makeGetStoresController = (): GetStoresController => {
  const storeDatasource = new StoreDatasourceImpl();
  const storeRepository = new StoreRepositoryImpl(storeDatasource);

  const getStoresUseCase = new GetStoresUseCase(storeRepository);

  return new GetStoresController(getStoresUseCase);
};
