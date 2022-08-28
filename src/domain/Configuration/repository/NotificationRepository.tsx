import {AxiosResponse} from 'axios';
import { NotificationGetResponse } from '../models/NotificationGet.model';
import { NotificationUpdateResponse, NotificationUpdateRequest } from '../models/NotificationUpdate.model';

export default interface NotificationRepository {
  getNotificationConfig(): Promise<AxiosResponse<NotificationGetResponse>>;
  updateNotificationState(updateNotificationRequest: NotificationUpdateRequest): Promise<AxiosResponse<NotificationUpdateResponse>>;
}