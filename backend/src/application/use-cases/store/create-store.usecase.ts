import { FileRepository, ICreateStoreRequest, StoreEntity, StoreRepository } from "../../../domain";

export class CreateStoreUseCase {
  constructor(private storeRepository: StoreRepository, private fileRepository: FileRepository) {}

  async execute(request: ICreateStoreRequest): Promise<StoreEntity> {
    const { body, file } = request;

    const { address, address_detail, municipality, name, suburb_name, zip_code } = body;

    let avatar_url: string | null = null;
    let avatar_name: string | null = null;

    if (file && file.buffer) {
      const { file_name, url } = await this.fileRepository.uploadImage(
        file.buffer,
        "/images/stores"
      );

      avatar_name = file_name;
      avatar_url = url;
    }

    const data = await this.storeRepository.create({
      address,
      address_detail,
      municipality,
      name,
      suburb_name,
      zip_code,
      avatar_url,
      avatar_name,
    });

    return data;
  }
}
