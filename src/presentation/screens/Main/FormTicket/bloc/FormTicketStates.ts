import { ActiveItem } from "../../ActiveSearch/bloc/ActiveSearchState";
import { CreateTicketData } from "../../../../../domain/FormAddTicket/models/FormTicket.models";

export interface CreatedTicketState {
    kind: 'CreatedTicketState',
    data: CreateTicketData,
}

export interface ErrorCreatedTicketState {
    kind: 'ErrorCreatedTicketState';
    error: string;
}

export interface LoadingCreatedTicketState {
    kind: 'LoadingCreatedTicketState',
}

export interface EmptyCreatedTicketState {
    kind: 'EmptyCreatedTicketState'
}
export interface GetActiveState {
    kind: 'GetActiveState',
    data: ActiveItem
}

export type FormTicketState =
    | CreatedTicketState
    | ErrorCreatedTicketState
    | LoadingCreatedTicketState
    | EmptyCreatedTicketState
    | GetActiveState;

export const initStateFormTicketState: FormTicketState = {
    kind: 'EmptyCreatedTicketState'
}
