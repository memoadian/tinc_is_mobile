export interface NotificationUpdateRequest {
    option: string;
    enabled: string;
}

export interface NotificationUpdateResponse {
    status: number;
    message: string;
    data: NotificationUpdateData;
    token: string;
}

export interface NotificationUpdateData {
    message: string;
    updated: number;
}