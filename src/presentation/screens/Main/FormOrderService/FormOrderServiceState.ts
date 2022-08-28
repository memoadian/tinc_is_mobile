import { ActiveItem } from "../../ActiveSearch/bloc/ActiveSearchState";
import { OrderServiceCreated } from "../../../../../domain/FormOrderService/model/FormOrderService.model";

export interface SavedOrderState {
    kind: 'SavedOrderState',
    data: OrderServiceCreated,
}

export interface ErrorSavedOrderState {
    kind: 'ErrorSavedOrderState';
    error: string;
}

export interface LoadingSavedOrderState {
    kind: 'LoadingSavedOrderState',
}

export interface EmptySavedOrderState {
    kind: 'EmptySavedOrderState'
}

export interface GetActiveState {
    kind: 'GetActiveState',
    data: ActiveItem
}

export type FormOrderServiceState =
    | SavedOrderState
    | ErrorSavedOrderState
    | LoadingSavedOrderState
    | EmptySavedOrderState
    | GetActiveState;

export const initStateFormOrderService: FormOrderServiceState = {
    kind: 'EmptySavedOrderState'
}
