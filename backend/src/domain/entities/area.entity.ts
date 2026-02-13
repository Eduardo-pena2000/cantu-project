import { ActivitieEntity } from "./activitie.entity";
import { UserEntity } from "./user.entity";

export class AreaEntity {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public manager?: UserEntity,
    public activities?: ActivitieEntity[]
  ) {}

  static fromObject(object: { [key: string]: any }): AreaEntity {
    const { id, name, code, manager, activities } = object;

    return new AreaEntity(id, name, code, manager, activities);
  }
}
