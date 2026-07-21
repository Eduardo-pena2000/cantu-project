import { v4 as uuid } from "uuid";
import { UploadApiResponse } from "cloudinary";
import sharp from "sharp";

import { UploadImageEntity } from "../../domain/entities";

import cloudinaryConfig from "../config/plugins/cloudinary.config";
import { envs } from "../config/plugins/envs.config";
import { AppError } from "../../shared";

export class FileStorageService {
  async uploadImage(buffer: Buffer, path: string): Promise<UploadImageEntity> {
    const file_name = uuid();

    if (!envs.CLOUDINARY_API_KEY) {
      console.warn("⚠️  FileStorageService: Cloudinary no configurado. Simulando subida de imagen para pruebas.");
      return { url: "https://placehold.co/400x400/png?text=Asistencia", file_name };
    }

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
    try {
      return await sharp(imageBuffer).webp().toBuffer();
    } catch (error) {
      throw AppError.badRequest("El archivo subido no es una imagen válida o está corrupto.");
    }
  }

  async deleteImage(file_name: string): Promise<void> {
    return await cloudinaryConfig.uploader.destroy(file_name);
  }
}
