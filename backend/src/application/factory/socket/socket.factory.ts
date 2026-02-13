import {
  NotificationDatasourceImpl,
  NotificationRepositoryImpl,
  SocketConfig,
  SocketHandler,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from "../../../infraestructure";

export const makeSocketConfig = (): SocketConfig => {
  const userDatasource = new UserDatasourceImpl();
  const userRepository = new UserRepositoryImpl(userDatasource);

  const notificationDatasource = new NotificationDatasourceImpl();
  const notificationRepository = new NotificationRepositoryImpl(notificationDatasource);

  const socketHandler = new SocketHandler(userRepository, notificationRepository);

  return new SocketConfig(socketHandler);
};
