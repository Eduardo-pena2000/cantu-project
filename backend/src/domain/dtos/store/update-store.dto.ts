import { CreateStoreDto } from "./create-store.dto";

export interface IUpdateStoreRequest {
  body: Partial<CreateStoreDto>;
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
  params: { id: number };
}
