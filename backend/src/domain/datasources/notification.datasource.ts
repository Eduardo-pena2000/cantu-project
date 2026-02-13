import { CreateNotificationDTO } from "../dtos";
import { NotificationEntity } from "../entities";

export abstract class NotificationDatasource {
  abstract create(data: CreateNotificationDTO): Promise<NotificationEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findAllByUser(user_id: number): Promise<NotificationEntity[]>;
  abstract findAll(is_read: boolean): Promise<NotificationEntity[]>;
  abstract findOne(id: number): Promise<NotificationEntity | null>;
  abstract update(id: number, data: Partial<CreateNotificationDTO>): Promise<void>;
}
