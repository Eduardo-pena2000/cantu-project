import { FindOptions } from "sequelize";

import { CreateStoreDto, IGetStoresParams, StoreDatasource, StoreEntity } from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import Store from "../database/models/store.model";

export class StoreDatasourceImpl implements StoreDatasource {
  private paginator: Paginator<Store>;

  constructor() {
    this.paginator = new Paginator(Store);
  }

  async create(data: CreateStoreDto): Promise<StoreEntity> {
    const store = await Store.create(data);

    return store;
  }

  async delete(id: number): Promise<void> {
    await Store.destroy({ where: { id } });
  }

  async findAll({ limit, page, where }: IGetStoresParams): Promise<PaginatedResponse<StoreEntity>> {
    const optionsQuery: FindOptions = {
      attributes: [
        "id",
        "address",
        "address_detail",
        "code",
        "municipality",
        "name",
        "suburb_name",
        "zip_code",
        "avatar_url",
        "avatar_name",
      ],
      order: [["id", "DESC"]],
      where,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(StoreEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findById(id: number): Promise<StoreEntity | null> {
    const store = await Store.findOne({
      attributes: [
        "id",
        "address",
        "address_detail",
        "code",
        "municipality",
        "name",
        "suburb_name",
        "zip_code",
        "avatar_url",
        "avatar_name",
      ],
      where: { id },
    });

    return store ? StoreEntity.fromObject(store) : null;
  }

  async update(id: number, data: Partial<CreateStoreDto>): Promise<void> {
    await Store.update(data, { where: { id } });
  }
}
