import { PaginatedResponse } from "../../shared";
import { CreateAreaDto, IGetStoresParams } from "../dtos";
import { AreaEntity } from "../entities";

export abstract class AreaRepository {
  abstract assignAreaToUsers(area_id: number, user_id: number): Promise<void>;
  abstract create(data: CreateAreaDto): Promise<AreaEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findAll(params: IGetStoresParams): Promise<PaginatedResponse<AreaEntity>>;
  abstract findById(id: number): Promise<AreaEntity | null>;
  abstract update(id: number, data: Partial<CreateAreaDto>): Promise<void>;
  abstract unassignAreaToUsers(area_id: number, user_id: number): Promise<void>;
  abstract userHasActiveAreaMember(user_id: number, area_id: number): Promise<boolean>;
}
