import { PaginatedResponse } from "../../shared";

import { CreateUserDto, IGetUsersParams, IUpdateUserDto } from "../dtos";
import { UserDeviceEntity, UserEntity } from "../entities";

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<UserEntity>;
  abstract createDevice(user_id: number, token: string): Promise<UserDeviceEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findAll(params: IGetUsersParams): Promise<PaginatedResponse<UserEntity>>;
  abstract findActivitiesForCurrentDay(store_id: number, schedule_id: number): Promise<UserEntity[]>;
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract findBySchedule(params: IGetUsersParams): Promise<PaginatedResponse<UserEntity>>;
  abstract findByScheduleForCurrentDay(schedule_id: number): Promise<UserEntity[]>;
  abstract findWithoutTeam(store_id: number, team_id: number): Promise<UserEntity[]>;
  abstract update(id: number, data: IUpdateUserDto): Promise<void>;
}
