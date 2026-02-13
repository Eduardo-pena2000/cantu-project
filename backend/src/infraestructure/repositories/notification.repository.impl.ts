import {
  CreateNotificationDTO,
  NotificationDatasource,
  NotificationEntity,
  NotificationRepository,
} from "../../domain";

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly datasource: NotificationDatasource) {}

  async create(data: CreateNotificationDTO): Promise<NotificationEntity> {
    return this.datasource.create(data);
  }

  async delete(id: number): Promise<void> {
    return this.datasource.delete(id);
  }

  async findAll(is_read: boolean): Promise<NotificationEntity[]> {
    return this.datasource.findAll(is_read);
  }

  async findAllByUser(user_id: number): Promise<NotificationEntity[]> {
    return this.datasource.findAllByUser(user_id);
  }

  async findOne(id: number): Promise<NotificationEntity | null> {
    return this.datasource.findOne(id);
  }

  async update(id: number, data: Partial<CreateNotificationDTO>): Promise<void> {
    return this.datasource.update(id, data);
  }
}
