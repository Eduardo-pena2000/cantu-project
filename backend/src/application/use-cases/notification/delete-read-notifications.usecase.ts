import { NotificationRepository } from "../../../domain";

export class DeleteReadNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(): Promise<void> {
    const notifications = await this.notificationRepository.findAll(true);

    await Promise.all(
      notifications.map(async (notification) => await this.notificationRepository.delete(notification.id))
    );
  }
}
