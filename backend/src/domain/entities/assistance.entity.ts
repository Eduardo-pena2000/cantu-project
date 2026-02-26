import { ActivitieAssignmentEntity } from "./activitie.entity";
import { UserEntity } from "./user.entity";
import { StoreEntity } from "./store.entity";

export class AssistanceEntity {
  constructor(
    public id: number,
    public employee_id: number,
    public taken_by_employee_id: number,
    public schedule_id: number,
    public status: string,
    public date_assistance: Date,
    public assistance_image_name: string | null,
    public assistance_image_url: string | null,
    public activities_asigments?: ActivitieAssignmentEntity[],
    public employee?: UserEntity,
    public taken_employee?: UserEntity,
    public store?: StoreEntity
  ) { }

  static fromObject(object: { [key: string]: any }): AssistanceEntity {
    const {
      id,
      employee_id,
      taken_by_employee_id,
      schedule_id,
      status,
      date_assistance,
      activities_asigments,
      assistance_image_name,
      assistance_image_url,
      employee,
      taken_employee,
      store,
    } = object;

    return new AssistanceEntity(
      id,
      employee_id,
      taken_by_employee_id,
      schedule_id,
      status,
      date_assistance,
      assistance_image_name,
      assistance_image_url,
      activities_asigments,
      employee,
      taken_employee,
      store
    );
  }
}
