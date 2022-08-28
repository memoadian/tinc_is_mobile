import { ProviderRequest } from "../../../../domain/ProviderSearch/models/ProviderSearch.model";

export interface LoadingProviderSearchState {
    kind: 'LoadingProviderSearchState',
    data: PagingProvider
}

export interface LoadedProviderSearchState {
    kind: 'LoadedProviderSearchState',
    data: PagingProvider
}

export interface ErrorProviderSeachState {
    kind: 'ErrorProviderSearchState',
    data: PagingProvider
    error: string,
}
export interface PagingProvider {
    items: ProviderItem[],
    query: ProviderRequest,
    totalRows: number,
    totalPages: number,
    page: number,
}
export interface ProviderItem {
    id?: string;
    image: string | null;
    id_tinc: string;
    name: string;
    bussinessName: string;
    country_name: string;
    state: string;
    city: string;
    isSelected: boolean;
}

export type ProviderSearchState =
    | LoadingProviderSearchState
    | LoadedProviderSearchState
    | ErrorProviderSeachState

export const initStateProviderSearch: ProviderSearchState = {
    kind: 'LoadingProviderSearchState',
    data: {
        items: [],
        query: {
            perPage: 1000,
            page: 1,
            sortDirection: 'ASC',
            textQuery: null
        },
        totalRows: 0,
        totalPages: 1,
        page: 1
    }
}