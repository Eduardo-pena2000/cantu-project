import { AreaEntity } from "./area.entity";
import { AssistanceEntity } from "./assistance.entity";
import { JobRoleEntity } from "./job-role.entity";
import { UserEntity } from "./user.entity";

export class ActivitieEntity {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public area: AreaEntity,
    public job_role: JobRoleEntity,
    public created_at: string,
    public default_deadline?: string | null
  ) {}

  static fromObject(object: { [key: string]: any }): ActivitieEntity {
    const { id, name, description, area, job_role, createdAt: created_at, default_deadline } = object;

    return new ActivitieEntity(id, name, description, area, job_role, created_at, default_deadline);
  }
}

export class ActivitieAssignmentEntity {
  constructor(
    public id: number,
    public deadline: string,
    public is_completed: boolean,
    public activitie_image_name: string | null,
    public activitie_image_url: string | null,
    public activity?: ActivitieEntity,
    public is_late?: boolean,
    public manager_note?: number,
    public shift_manager_note?: number,
    public note?: number,
    public manager_comments?: string,
    public shift_manager_comments?: string,
    public date_completed?: string,
    public taken_employee?: UserEntity,
    public employee?: UserEntity,
    public assistance?: AssistanceEntity
  ) {}

  static fromObject(object: { [key: string]: any }): ActivitieAssignmentEntity {
    const {
      id,
      deadline,
      is_completed,
      activity,
      is_late,
      manager_note,
      shift_manager_note,
      manager_comments,
      shift_manager_comments,
      date_completed,
      taken_employee,
      employee,
      assistance,
      note,
      activitie_image_name,
      activitie_image_url,
    } = object;

    return new ActivitieAssignmentEntity(
      id,
      deadline,
      is_completed,
      activitie_image_name,
      activitie_image_url,
      activity,
      is_late,
      manager_note,
      shift_manager_note,
      note,
      manager_comments,
      shift_manager_comments,
      date_completed,
      taken_employee,
      employee,
      assistance
    );
  }
}
