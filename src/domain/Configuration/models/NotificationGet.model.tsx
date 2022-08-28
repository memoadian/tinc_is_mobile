export interface NotificationGetResponse {
    status: number,
    message: string,
    data: NotificationGetData,
    token: string,
}

export interface NotificationGetData {
    total_rows: number,
    per_page: number,
    page: number,
    total_pages: number,
    data: NotificationGetDataArray[],
}

export interface NotificationGetDataArray {
    id: string
    is_user_profile_id?: string,
    is_user_alert_cat_id?: string,
    is_user_alert_cat_name?: string,
    enabled: string,
    create_at: string,
    update_at: string,
}
