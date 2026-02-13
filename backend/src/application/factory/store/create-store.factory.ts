import {
  FileRepositoryImpl,
  ImageProcessorService,
  StoreDatasourceImpl,
  StoreRepositoryImpl,
} from "../../../infraestructure";
import { CreateStoreController } from "../../../presentation";

import { CreateStoreUseCase } from "../../use-cases";

export const makeCreateStoreController = (): CreateStoreController => {
  const storeDatasource = new StoreDatasourceImpl();
  const storeRepository = new StoreRepositoryImpl(storeDatasource);

  const fileRepository = new FileRepositoryImpl(new ImageProcessorService());

  const createStoreUseCase = new CreateStoreUseCase(storeRepository, fileRepository);

  return new CreateStoreController(createStoreUseCase);
};
