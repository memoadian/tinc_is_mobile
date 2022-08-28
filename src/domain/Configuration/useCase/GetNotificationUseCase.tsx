import { AxiosResponse } from "axios";
import NotificationRepository from "../repository/NotificationRepository";
import { NotificationGetResponse } from '../models/NotificationGet.model';

export default class GetNotificationUseCase {

    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository
    }

    invoke(): Promise<AxiosResponse<NotificationGetResponse>> {
        return this.notificationRepository.getNotificationConfig()
    }

}