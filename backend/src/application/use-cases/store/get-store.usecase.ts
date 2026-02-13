import { IGetStoreRequest, StoreEntity, StoreRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class GetStoreUseCase {
  constructor(private storeRepository: StoreRepository) {}

  async execute(request: IGetStoreRequest): Promise<StoreEntity> {
    const { params } = request;

    const store = await this.storeRepository.findById(params.id);

    if (!store) {
      throw AppError.notFound("La tienda no existe");
    }

    return store;
  }
}
