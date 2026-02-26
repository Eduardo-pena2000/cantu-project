import { ActivitieEntity } from "./activitie.entity";
import { UserEntity } from "./user.entity";

export class AreaEntity {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public manager?: UserEntity,
    public users?: UserEntity[],
    public activities?: ActivitieEntity[]
  ) { }

  static fromObject(object: { [key: string]: any }): AreaEntity {
    const { id, name, code, manager, users, activities } = object;

    return new AreaEntity(id, name, code, manager, users, activities);
  }
}
