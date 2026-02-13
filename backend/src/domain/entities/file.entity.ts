export class UploadImageEntity {
  constructor(public url: string, public file_name: string) {}

  static fromObject(object: { [key: string]: any }): UploadImageEntity {
    const { url, file_name } = object;

    return new UploadImageEntity(url, file_name);
  }
}
