import { TicketData, TicketRequest } from "../../../../domain/ListTickets/models/Ticket.model";
import { TicketDataDeleted } from "../../../../domain/ListTickets/models/TicketDelete.model";
export interface SleepTicketsState {
    kind: 'SleepTicketsState';
    info: TicketsInfo;
}

export interface LoadingTicketsState {
    kind: 'LoadingTicketsState';
    info: TicketsInfo;
}

export interface ErrorTicketState {
    kind: 'ErrorTicketState';
    info: TicketsInfo;
    error: string;
}

export interface LoadedTicketsState {
    kind: 'LoadedTicketsState';
    info: TicketsInfo;
}

export interface DeleteTicketLoadingState {
    kind: 'DeleteTicketLoadingState';
    info: TicketsInfo;
}

export interface DeleteTicketDeletedState {
    kind: 'DeleteTicketDeletedState';
    info: TicketsInfo;
    delete: TicketDataDeleted
}

export interface DeleteTicketErrorState {
    kind: 'DeleteTicketErrorState';
    info: TicketsInfo;
    error: string;
}

export interface TicketsInfo {
    totalRows: number;
    totalPages: number;
    tickets: TicketData[];
    query: TicketRequest;
}

export type TicketState =
    | LoadingTicketsState
    | ErrorTicketState
    | LoadedTicketsState
    | DeleteTicketLoadingState
    | DeleteTicketErrorState
    | DeleteTicketDeletedState
    | SleepTicketsState;

export const ticketsInitState: TicketState = {
    kind: 'LoadingTicketsState',
    info: {
        totalRows: 0,
        totalPages: 1,
        tickets: [],
        query: {
            page: 1,
            perpage: 50,
            is_user_profile_id: null,
            is_account_main_id: null,
            mobile_searcher: null,
            request_date_auto: null,
            ticket_priority_multi: null,
            ticket_request_multi: null,
            ticket_status_name: null,
            is_account_location_id: null,
            ordertype: 'DESC',
            orderby: 'create_at',
            queryPath: null
        }
    },
}