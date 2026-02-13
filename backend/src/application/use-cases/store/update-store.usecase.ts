import { FileRepository, IUpdateStoreRequest, StoreRepository } from "../../../domain";
import { AppError } from "../../../shared";

export class UpdateStoreUseCase {
  constructor(private storeRepository: StoreRepository, private fileRepository: FileRepository) {}

  async execute(request: IUpdateStoreRequest): Promise<void> {
    const { body, file, params } = request;

    const { address, address_detail, municipality, name, suburb_name, zip_code } = body;

    let avatar_url: string | null = null;
    let avatar_name: string | null = null;

    const store = await this.storeRepository.findById(params.id);

    if (!store) {
      throw AppError.notFound("Tienda no existe");
    }

    if (file && file.buffer) {
      if (store.avatar_name) {
        await this.fileRepository.deleteImage(store.avatar_name);
      }

      const { file_name, url } = await this.fileRepository.uploadImage(
        file.buffer,
        "/images/stores"
      );

      avatar_name = file_name;
      avatar_url = url;
    } else {
      avatar_name = store.avatar_name || null;
      avatar_url = store.avatar_url || null;
    }

    await this.storeRepository.update(store.id, {
      address,
      address_detail,
      municipality,
      name,
      suburb_name,
      zip_code,
      avatar_url,
      avatar_name,
    });
  }
}
