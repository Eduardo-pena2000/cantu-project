import { AreaEntity } from "./area.entity";
import { AssistanceEntity } from "./assistance.entity";
import { RoleEntity } from "./role.entity";
import { ShiftScheduleEntity } from "./shift.entity";
import { StoreEntity } from "./store.entity";
import { TeamEntity, TeamManagerInfoEntity } from "./team.entity";

export class UserDeviceEntity {
  constructor(public id: number, public token: string) {}

  static fromObject(object: { [key: string]: any }): UserDeviceEntity {
    const { id, token } = object;

    return new UserDeviceEntity(id, token);
  }
}

export class UserEntity {
  constructor(
    public id: number,
    public email: string,
    public names: string,
    public username: string,
    public last_names: string,
    public avatar_name: string,
    public avatar_url: string,
    public last_login: Date | null,
    public password: string,
    public is_active: boolean,
    public phone: string,
    public store: StoreEntity,
    public roles: RoleEntity[],
    public areas: AreaEntity[],
    public manager_info?: TeamManagerInfoEntity,
    public assistance?: AssistanceEntity,
    public assigned_activities?: number,
    public completed_activities?: number,
    public incomplete_activities?: number,
    public late_activities?: number,
    public avg_note?: number,
    public is_main_manager?: boolean,
    public schedules?: ShiftScheduleEntity[],
    public teams?: TeamEntity[],
    public devices_tokens?: UserDeviceEntity[],
    public has_device_token?: boolean
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const {
      id,
      email,
      last_names,
      names,
      username,
      avatar_name,
      avatar_url,
      last_login,
      password,
      is_active,
      phone,
      store,
      roles,
      areas,
      manager_info,
      assistance,
      assigned_activities,
      completed_activities,
      incomplete_activities,
      late_activities,
      avg_note,
      is_main_manager,
      schedules,
      teams,
      devices_tokens,
      has_device_token,
    } = object;

    return new UserEntity(
      id,
      email,
      names,
      username,
      last_names,
      avatar_name,
      avatar_url,
      last_login,
      password,
      is_active,
      phone,
      store,
      roles,
      areas,
      manager_info,
      assistance,
      assigned_activities,
      completed_activities,
      incomplete_activities,
      late_activities,
      avg_note,
      is_main_manager,
      schedules,
      teams,
      devices_tokens,
      has_device_token
    );
  }
}
