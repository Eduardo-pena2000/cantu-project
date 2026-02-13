import {
  FileRepositoryImpl,
  ImageProcessorService,
  StoreDatasourceImpl,
  StoreRepositoryImpl,
} from "../../../infraestructure";
import { UpdateStoreController } from "../../../presentation";

import { UpdateStoreUseCase } from "../../use-cases";

export const makeUpdateStoreController = (): UpdateStoreController => {
  const storeDatasource = new StoreDatasourceImpl();
  const storeRepository = new StoreRepositoryImpl(storeDatasource);

  const fileRepository = new FileRepositoryImpl(new ImageProcessorService());

  const updateStoreUseCase = new UpdateStoreUseCase(storeRepository, fileRepository);

  return new UpdateStoreController(updateStoreUseCase);
};
