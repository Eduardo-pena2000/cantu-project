import { ActivitieEntity } from "./activitie.entity";
import { StoreEntity } from "./store.entity";

export class JobRoleEntity {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public created_at: string,
    public store?: StoreEntity,
    public activities?: ActivitieEntity[],
  ) {}

  static fromObject(object: { [key: string]: any }): JobRoleEntity {
    const { id, name, code, store, activities, createdAt: created_at } = object;

    return new JobRoleEntity(id, name, code, created_at, store, activities);
  }
}
