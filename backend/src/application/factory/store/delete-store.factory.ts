import { StoreDatasourceImpl, StoreRepositoryImpl } from "../../../infraestructure";
import { DeleteStoreController } from "../../../presentation";

import { DeleteStoreUseCase } from "../../use-cases";

export const makeDeleteStoreController = (): DeleteStoreController => {
  const storeDatasource = new StoreDatasourceImpl();
  const storeRepository = new StoreRepositoryImpl(storeDatasource);

  const deleteStoreUseCase = new DeleteStoreUseCase(storeRepository);

  return new DeleteStoreController(deleteStoreUseCase);
};
