export interface LoadingNotificationState {
    kind: 'LoadingNotificationState',
}

export interface PrintNotificationState{
    kind: 'PrintNotificationState',
    data: NotificationDataState[]
}

export interface ErrorNotificationState {
    kind: 'ErrorNotificationState';
    error: string;
}

export interface EmptyNotificationState {
    kind: 'EmptyNotificationState'
}
export type NotificationState =
    | LoadingNotificationState
    | PrintNotificationState
    | ErrorNotificationState
    | EmptyNotificationState

export const initStateNotificationState: NotificationState = {
    kind: 'LoadingNotificationState'
}

export interface NotificationDataState {
    id: string,
    is_user_alert_cat_id?: string,
    is_user_alert_cat_name?: string,
    enabled: string,
}