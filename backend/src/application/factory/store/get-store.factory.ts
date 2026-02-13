import { StoreDatasourceImpl, StoreRepositoryImpl } from "../../../infraestructure";
import { GetStoreController } from "../../../presentation";

import { GetStoreUseCase } from "../../use-cases";

export const makeGetStoreController = (): GetStoreController => {
  const storeDatasource = new StoreDatasourceImpl();
  const storeRepository = new StoreRepositoryImpl(storeDatasource);

  const getStoreUseCase = new GetStoreUseCase(storeRepository);

  return new GetStoreController(getStoreUseCase);
};
