export interface ServiceDeleteResponse {
    status: number;
    message: string;
    data: ServiceDataDeleted;
    token: string;
}
export interface ServiceDataDeleted {
    message: string;
    deleted: number;
}
