import {
  CreateStoreDto,
  IGetStoresParams,
  StoreDatasource,
  StoreEntity,
  StoreRepository,
} from "../../domain";
import { PaginatedResponse } from "../../shared";

export class StoreRepositoryImpl implements StoreRepository {
  constructor(private readonly datasource: StoreDatasource) {}

  async create(data: CreateStoreDto): Promise<StoreEntity> {
    return await this.datasource.create(data);
  }

  async delete(id: number): Promise<void> {
    return await this.datasource.delete(id);
  }

  async findAll(params: IGetStoresParams): Promise<PaginatedResponse<StoreEntity>> {
    return await this.datasource.findAll(params);
  }

  async findById(id: number): Promise<StoreEntity | null> {
    return await this.datasource.findById(id);
  }

  async update(id: number, data: Partial<CreateStoreDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }
}
