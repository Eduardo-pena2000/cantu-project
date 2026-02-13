export interface CreateStoreDto {
  name: string;
  address: string;
  address_detail: string;
  suburb_name: string;
  zip_code: string;
  municipality: string;
  avatar_name?: string | null;
  avatar_url?: string | null;
}

export interface ICreateStoreRequest {
  body: CreateStoreDto;
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
}
