import { NotificationDatasourceImpl } from "../../../infraestructure/datasources";
import { NotificationRepositoryImpl } from "../../../infraestructure/repositories";

import { DeleteReadNotificationsUseCase } from "../../use-cases";

export const makeDeleteReadNotifications = (): DeleteReadNotificationsUseCase => {
  const notificationDatasource = new NotificationDatasourceImpl();
  const notificationRepository = new NotificationRepositoryImpl(notificationDatasource);

  return new DeleteReadNotificationsUseCase(notificationRepository);
};
