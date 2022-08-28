import { AxiosResponse } from "axios";
import ApiService from "../../presentation/core/api/ApiService";
import NotificationRepository from '../../domain/Configuration/repository/NotificationRepository';
import { NotificationGetResponse } from "../../domain/Configuration/models/NotificationGet.model";
import { NotificationUpdateRequest, NotificationUpdateResponse } from "../../domain/Configuration/models/NotificationUpdate.model";

export default class NotificationDataSource implements NotificationRepository {
    getNotificationConfig(): Promise<AxiosResponse<NotificationGetResponse, any>> {
        return ApiService.get(`/useralertsettings?perpage=10`)
    }
    updateNotificationState(updateNotificationRequest: NotificationUpdateRequest): Promise<AxiosResponse<NotificationUpdateResponse, any>> {
        return ApiService.put(`/useralertsettings/${updateNotificationRequest.option}`, {
            enabled: updateNotificationRequest.enabled
            })
    }
}
