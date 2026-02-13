import { UploadImageEntity } from "../entities";

export abstract class FileRepository {
  abstract uploadImage(buffer: Buffer, path: string): Promise<UploadImageEntity>;
  abstract deleteImage(file_name: string): Promise<void>;
}
