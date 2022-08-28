import { ActiveRequest } from "../../../../../domain/ActiveSearch/models/ActiveSearch.model";

export interface LoadingActiveSearchState {
    kind: 'LoadingActiveSearchState',
    data: PagingActive,
}

export interface LoadedActiveSearchState {
    kind: 'LoadedActiveSearchState',
    data: PagingActive,
}

export interface ErrorActiveSeachState {
    kind: 'ErrorActiveSearchState',
    data: PagingActive,
    error: string,
}

export interface ActiveItem {
    id: string;
    idTinc: string;
    asset_brand_name: string;
    model: string;
    serialNumber: string;
    assetCategoryName: string;
    locationName: string;
    sublocationName: string;
    isSelected: boolean;
    image: string;
    asset_type_name: string;
    is_account_location_id: string;
    is_account_main_id: string;
    is_asset_status_cat_id: number;
}

export interface PagingActive {
    items: ActiveItem[];
    query: ActiveRequest,
    totalRows: number,
    totalPages: number,
}

export type ActiveSearchState =
    | LoadingActiveSearchState
    | LoadedActiveSearchState
    | ErrorActiveSeachState

export const initStateActiveSearch: ActiveSearchState = {
    kind: 'LoadingActiveSearchState',
    data: {
        items: [],
        query: {
            perPage: 50,
            page: 1,
            sortDirection: 'ASC',
            accountMain: 0,
            textQuery: null,
        },
        totalPages: 1,
        totalRows: 0
    }
}