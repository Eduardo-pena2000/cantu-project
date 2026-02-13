import { v4 as uuid } from "uuid";
import { UploadApiResponse } from "cloudinary";
import sharp from "sharp";

import { UploadImageEntity } from "../../domain/entities";

import cloudinaryConfig from "../config/plugins/cloudinary.config";

export class FileStorageService {
  async uploadImage(buffer: Buffer, path: string): Promise<UploadImageEntity> {
    const file_name = uuid();

    const image = await this.changeImageFormat(buffer);

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

  async changeImageFormat(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer).webp().toBuffer();
  }

  async deleteImage(file_name: string): Promise<void> {
    return await cloudinaryConfig.uploader.destroy(file_name);
  }
}
