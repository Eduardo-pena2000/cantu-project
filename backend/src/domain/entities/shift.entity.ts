import { StoreEntity } from "./store.entity";
import { TeamEntity } from "./team.entity";

export class ShiftScheduleEntity {
  constructor(
    public id: number,
    public day: string,
    public week_day: number,
    public is_weekend: boolean,
    public start_time: string,
    public end_time: string,
    public shift: ShiftEntity
  ) {}

  static fromObject(object: { [key: string]: any }): ShiftScheduleEntity {
    const { id, day, week_day, is_weekend, start_time, end_time, shift } = object;

    return new ShiftScheduleEntity(id, day, week_day, is_weekend, start_time, end_time, shift);
  }
}

export class ShiftEntity {
  constructor(
    public id: number,
    public name: string,
    public schedules: ShiftScheduleEntity[],
    public store: StoreEntity,
    public schedule_info?: ShiftScheduleEntity,
    public team?: TeamEntity
  ) {}

  static fromObject(object: { [key: string]: any }): ShiftEntity {
    const { id, name, schedules, store, schedule_info, team } = object;

    return new ShiftEntity(id, name, schedules, store, schedule_info, team);
  }
}
