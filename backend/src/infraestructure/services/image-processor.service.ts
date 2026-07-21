import sharp from "sharp";
import { AppError } from "../../shared";

export class ImageProcessorService {
  async changeImageFormat(
    imageBuffer: Buffer,
    format: "webp" | "png" | "jpeg" = "webp"
  ): Promise<Buffer> {
    try {
      return await sharp(imageBuffer).toFormat(format).toBuffer();
    } catch (error) {
      throw AppError.badRequest("El archivo subido no es una imagen válida o está corrupto.");
    }
  }

  async resizeImage(imageBuffer: Buffer, width: number, height: number): Promise<Buffer> {
    return sharp(imageBuffer).resize(width, height).toBuffer();
  }
}
