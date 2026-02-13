import sharp from "sharp";

export class ImageProcessorService {
  async changeImageFormat(
    imageBuffer: Buffer,
    format: "webp" | "png" | "jpeg" = "webp"
  ): Promise<Buffer> {
    return sharp(imageBuffer).toFormat(format).toBuffer();
  }

  async resizeImage(imageBuffer: Buffer, width: number, height: number): Promise<Buffer> {
    return sharp(imageBuffer).resize(width, height).toBuffer();
  }
}
