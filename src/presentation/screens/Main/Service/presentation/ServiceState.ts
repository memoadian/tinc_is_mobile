import { ServiceData, ServiceRequest } from "../../../../../domain/ListService/models/Service.model";
import { ServiceDataDeleted } from "../../../../../domain/ListService/models/ServiceDelete.model";

export interface SleepServicesState {
    kind: 'SleepServicesState';
    info: ServicesInfo;
}

export interface LoadingServicesState {
    kind: 'LoadingServicesState';
    info: ServicesInfo;
}

export interface ErrorServiceState {
    kind: 'ErrorServiceState';
    info: ServicesInfo;
    error: string;
}

export interface LoadedServicesState {
    kind: 'LoadedServicesState';
    info: ServicesInfo;
}

export interface DeleteServiceLoadingState {
    kind: 'DeleteServiceLoadingState';
    info: ServicesInfo;
}

export interface DeleteServiceDeletedState {
    kind: 'DeleteServiceDeletedState';
    info: ServicesInfo;
    delete: ServiceDataDeleted
}

export interface DeleteServiceErrorState {
    kind: 'DeleteServiceErrorState';
    info: ServicesInfo;
    error: string;
}

export interface ServicesInfo {
    totalRows: number;
    totalPages: number;
    services: ServiceData[];
    query: ServiceRequest;
}

export type ServiceState =
    | LoadingServicesState
    | ErrorServiceState
    | LoadedServicesState
    | DeleteServiceLoadingState
    | DeleteServiceErrorState
    | DeleteServiceDeletedState
    | SleepServicesState;

export const servicesInitState: ServiceState = {
    kind: 'LoadingServicesState',
    info: {
        totalRows: 0,
        totalPages: 1,
        services: [],
        query: {
            page: 1,
            perpage: 50,
            is_user_profile_id: null,
            is_account_main_id: null,
            mobile_searcher: null,
            scheduled_date_auto: null,
            service_priority_multi: null,
            service_type_multi: null,
            service_status_multi: null,
            asset_location_id: null,
            ordertype: 'DESC',
            orderby: 'scheduled_date',
            queryPath: null
        }
    },
}