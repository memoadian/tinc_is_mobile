export interface TicketDeleteResponse {
    status: number;
    message: string;
    data: TicketDataDeleted;
    token: string;
}
export interface TicketDataDeleted {
    message: string;
    deleted: number;
}
