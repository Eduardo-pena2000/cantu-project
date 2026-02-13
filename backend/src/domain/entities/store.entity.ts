import { UserEntity } from "./user.entity";

export class StoreEntity {
  constructor(
    public id: number,
    public name: string,
    public address: string,
    public code: string,
    public address_detail: string,
    public suburb_name: string,
    public zip_code: string,
    public municipality: string,
    public avatar_name?: string | null,
    public avatar_url?: string | null,
    public users?: UserEntity[]
  ) {}

  static fromObject(object: { [key: string]: any }): StoreEntity {
    const {
      id,
      name,
      address,
      code,
      address_detail,
      suburb_name,
      zip_code,
      avatar_url,
      avatar_name,
      municipality,
      users,
    } = object;

    return new StoreEntity(
      id,
      name,
      address,
      code,
      address_detail,
      suburb_name,
      zip_code,
      municipality,
      avatar_name,
      avatar_url,
      users
    );
  }
}
