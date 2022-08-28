import { AxiosResponse } from "axios";
import NotificationRepository from "../repository/NotificationRepository";
import { NotificationUpdateRequest, NotificationUpdateResponse } from '../models/NotificationUpdate.model';

export default class UpdateNotificationUseCase {

    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository
    }

    invoke(request: NotificationUpdateRequest): Promise<AxiosResponse<NotificationUpdateResponse>> {
        return this.notificationRepository.updateNotificationState(request)
    }

}