import { UserDatasource, UserDeviceEntity, UserEntity, UserRepository } from "../../domain";
import { CreateUserDto, IGetUsersParams } from "../../domain/dtos";
import { PaginatedResponse } from "../../shared";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDatasource) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    return await this.datasource.create(data);
  }

  async createDevice(user_id: number, token: string): Promise<UserDeviceEntity> {
    return this.datasource.createDevice(user_id, token);
  }

  async delete(id: number): Promise<void> {
    return await this.datasource.delete(id);
  }

  async findAll(params: IGetUsersParams): Promise<PaginatedResponse<UserEntity>> {
    return await this.datasource.findAll(params);
  }

  async findActivitiesForCurrentDay(store_id: number, schedule_id: number): Promise<UserEntity[]> {
    return await this.datasource.findActivitiesForCurrentDay(store_id, schedule_id);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.datasource.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.datasource.findByEmail(email);
  }

  async findBySchedule(params: IGetUsersParams): Promise<PaginatedResponse<UserEntity>> {
    return await this.datasource.findBySchedule(params);
  }

  async findByScheduleForCurrentDay(schedule_id: number): Promise<UserEntity[]> {
    return await this.datasource.findByScheduleForCurrentDay(schedule_id);
  }

  async findWithoutTeam(store_id: number, team_id: number): Promise<UserEntity[]> {
    return this.datasource.findWithoutTeam(store_id, team_id);
  }

  async update(id: number, data: Partial<CreateUserDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }
}
