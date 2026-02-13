import { ShiftEntity } from "./shift.entity";
import { StoreEntity } from "./store.entity";
import { UserEntity } from "./user.entity";

export class TeamEntity {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public is_active: boolean,
    public store?: StoreEntity,
    public shift?: ShiftEntity,
    public users?: UserEntity[],
    public managers?: UserEntity[]
  ) {}

  static fromObject(object: { [key: string]: any }): TeamEntity {
    const { id, name, code, is_active, store, shift, users, managers } = object;

    return new TeamEntity(id, name, code, is_active, store, shift, users, managers);
  }
}

export class TeamUserEntity {
  constructor(
    public id: number,
    public team_id: number,
    public user_id: number,
    public is_active: boolean,
    public team?: TeamEntity
  ) {}

  static fromObject(object: { [key: string]: any }): TeamUserEntity {
    const { id, team_id, user_id, is_active, team } = object;

    return new TeamUserEntity(id, team_id, user_id, is_active, team);
  }
}

export class TeamManagerInfoEntity {
  constructor(public is_main_manager: boolean, public start_date: Date, public end_date: Date) {}

  static fromObject(object: { [key: string]: any }): TeamManagerInfoEntity {
    const { is_main_manager, start_date, end_date } = object;

    return new TeamManagerInfoEntity(is_main_manager, start_date, end_date);
  }
}
