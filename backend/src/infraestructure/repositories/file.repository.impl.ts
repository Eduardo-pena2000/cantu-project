import { v4 as uuid } from "uuid";
import { UploadApiResponse } from "cloudinary";

import { FileRepository, UploadImageEntity } from "../../domain";

import cloudinaryConfig from "../config/plugins/cloudinary.config";

import { ImageProcessorService } from "../services";

export class FileRepositoryImpl implements FileRepository {
  constructor(private imageProcessor: ImageProcessorService) {}

  async uploadImage(buffer: Buffer, path: string): Promise<UploadImageEntity> {
    const file_name = uuid();

    const image = await this.imageProcessor.changeImageFormat(buffer, "webp");

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream: NodeJS.WritableStream = cloudinaryConfig.uploader.upload_stream(
        { folder: path, public_id: `${file_name}` },
        (err: import("cloudinary").UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );

      uploadStream.end(image);
    });

    return { url: result.secure_url, file_name };
  }

  async deleteImage(file_name: string): Promise<void> {
    return await cloudinaryConfig.uploader.destroy(file_name);
  }
}
