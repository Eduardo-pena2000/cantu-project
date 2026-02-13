import { CreateNotificationDTO, NotificationEntity } from "../../domain";
import { NotificationDatasource } from "../../domain/datasources";

import Notification from "../database/models/notification.model";

export class NotificationDatasourceImpl implements NotificationDatasource {
  async create(data: CreateNotificationDTO): Promise<NotificationEntity> {
    const notification = await Notification.create(data);

    return NotificationEntity.fromObject(notification);
  }

  async delete(id: number): Promise<void> {
    await Notification.destroy({ where: { id } });
  }

  async findAll(is_read: boolean): Promise<NotificationEntity[]> {
    const notifications = await Notification.findAll({
      attributes: ["id", "title", "description", "type", "date", "is_read", "metadata"],
      order: [
        ["is_read", "ASC"],
        ["date", "DESC"],
      ],
      where: { is_read },
    });

    return notifications.map(NotificationEntity.fromObject);
  }

  async findAllByUser(user_id: number): Promise<NotificationEntity[]> {
    const notifications = await Notification.findAll({
      attributes: ["id", "title", "description", "type", "date", "is_read", "metadata"],
      order: [
        ["is_read", "ASC"],
        ["date", "DESC"],
      ],
      where: { user_id },
    });

    return notifications.map(NotificationEntity.fromObject);
  }

  async findOne(id: number): Promise<NotificationEntity | null> {
    const notification = await Notification.findOne({
      attributes: ["id", "title", "description", "type", "date", "is_read", "metadata"],
      where: { id },
    });

    return notification ? NotificationEntity.fromObject(notification) : null;
  }

  async update(id: number, data: Partial<CreateNotificationDTO>): Promise<void> {
    await Notification.update(data, { where: { id } });
  }
}
