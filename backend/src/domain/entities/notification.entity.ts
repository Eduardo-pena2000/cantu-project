import { UserEntity } from "./user.entity";

export class NotificationEntity {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public type: string,
    public is_read: boolean,
    public user: UserEntity,
    public date: Date,
    public metadata: { [key: string]: any }
  ) {}

  static fromObject(object: { [key: string]: any }): NotificationEntity {
    const { id, title, description, type, is_read, user, date, metadata } = object;

    return new NotificationEntity(id, title, description, type, is_read, user, date, metadata);
  }
}
