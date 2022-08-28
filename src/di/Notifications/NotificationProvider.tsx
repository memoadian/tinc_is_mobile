import NotificationDataSource from '../../data/Notifications/NotificationsDataSource';
import GetNotificationUseCase from '../../domain/Configuration/useCase/GetNotificationUseCase';
import UpdateNotificationUseCase from '../../domain/Configuration/useCase/UpdateNotificationUseCase';
import { NotificationBloc } from '../../presentation/screens/Main/Configuration/bloc/NotificationBloc';

function providerNotificationBloc(): NotificationBloc {
  const repository = new NotificationDataSource();
  const getNotification = new GetNotificationUseCase(repository);
  const updateNotification = new UpdateNotificationUseCase(repository);
  return new NotificationBloc(getNotification, updateNotification);
}

export const notificationModule = {
    providerNotificationBloc
}
