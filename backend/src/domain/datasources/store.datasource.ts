import { PaginatedResponse } from "../../shared";

import { CreateStoreDto, IGetStoresParams } from "../dtos";
import { StoreEntity } from "../entities";

export abstract class StoreDatasource {
  abstract create(data: CreateStoreDto): Promise<StoreEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findAll(params: IGetStoresParams): Promise<PaginatedResponse<StoreEntity>>;
  abstract findById(id: number): Promise<StoreEntity | null>;
  abstract update(id: number, data: Partial<CreateStoreDto>): Promise<void>;
}
