import { IDeleteStoreRequest, StoreRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class DeleteStoreUseCase {
  constructor(private storeRepository: StoreRepository) {}

  async execute(request: IDeleteStoreRequest): Promise<void> {
    const { params } = request;

    const store = await this.storeRepository.findById(params.id);

    if (!store) {
      throw AppError.notFound("La tienda no existe");
    }

    await this.storeRepository.delete(params.id);
  }
}
