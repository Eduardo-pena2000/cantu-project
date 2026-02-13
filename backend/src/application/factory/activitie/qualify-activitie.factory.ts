import {
  ActivitieDatasourceImpl,
  ActivitieRepositoryImpl,
  FileRepositoryImpl,
  ImageProcessorService,
  NotificationDatasourceImpl,
  NotificationRepositoryImpl,
  RoleDatasourceImpl,
  RoleRepositoryImpl,
  SocketAdapter,
} from "../../../infraestructure";
import { QualifyActivitieController } from "../../../presentation";

import { QualifyActivitieUseCase } from "../../use-cases";

export const makeQualifyActivitieController = (): QualifyActivitieController => {
  const activitieDatasource = new ActivitieDatasourceImpl();
  const activitieRepository = new ActivitieRepositoryImpl(activitieDatasource);

  const fileRepository = new FileRepositoryImpl(new ImageProcessorService());

  const notificationDatasource = new NotificationDatasourceImpl();
  const notificationRepository = new NotificationRepositoryImpl(notificationDatasource);

  const roleDatasource = new RoleDatasourceImpl();
  const roleRepository = new RoleRepositoryImpl(roleDatasource);

  const socketAdapter = new SocketAdapter();

  const useCase = new QualifyActivitieUseCase(
    activitieRepository,
    fileRepository,
    notificationRepository,
    roleRepository,
    socketAdapter
  );

  return new QualifyActivitieController(useCase);
};
