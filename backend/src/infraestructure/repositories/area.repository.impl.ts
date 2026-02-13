import {
  AreaDatasource,
  AreaEntity,
  AreaRepository,
  CreateAreaDto,
  IGetAreasParams,
} from "../../domain";
import { PaginatedResponse } from "../../shared";

export class AreaRepositoryImpl implements AreaRepository {
  constructor(private readonly datasource: AreaDatasource) {}

  async assignAreaToUsers(area_id: number, user_id: number): Promise<void> {
    return await this.datasource.assignAreaToUsers(area_id, user_id);
  }

  async create(data: CreateAreaDto): Promise<AreaEntity> {
    return this.datasource.create(data);
  }

  async delete(id: number): Promise<void> {
    return this.datasource.delete(id);
  }

  async findAll(params: IGetAreasParams): Promise<PaginatedResponse<AreaEntity>> {
    return await this.datasource.findAll(params);
  }

  async findById(id: number): Promise<AreaEntity | null> {
    return await this.datasource.findById(id);
  }

  async update(id: number, data: Partial<CreateAreaDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }

  async unassignAreaToUsers(area_id: number, user_id: number): Promise<void> {
    return await this.datasource.unassignAreaToUsers(area_id, user_id);
  }

  async userHasActiveAreaMember(user_id: number, area_id: number): Promise<boolean> {
    return await this.datasource.userHasActiveAreaMember(user_id, area_id);
  }
}
